import ProvedorCriptografia from './ProvedorCriptografia'
import ColecaoUsuario from './ColecaoUsuario'
import Usuario from './Usuario'
import CasoDeUso from '../shared/CasoDeUso'
import ProvedorToken from './ProvedorToken'

export type Entrada = { email: string; senha: string }
export type Saida = { usuario: Usuario; token: string }

export default class LoginUsuario implements CasoDeUso<Entrada, Saida> {
    constructor(
        private colecao: ColecaoUsuario,
        private provedorCripto: ProvedorCriptografia,
        private provedorToken: ProvedorToken
    ) {}

    async executar(dto: Entrada): Promise<Saida> {
        const usuarioExistente = await this.colecao.buscarPorEmail(dto.email)
        if (!usuarioExistente) throw new Error('Usuário não existe.')

        const mesmaSenha = this.provedorCripto.comparar(
            dto.senha,
            usuarioExistente.senha!
        )
        if (!mesmaSenha) throw new Error('Senha incorreta.')
        return {
            usuario: { ...usuarioExistente, senha: undefined },
            token: this.provedorToken.gerar({
                id: usuarioExistente.id,
                nome: usuarioExistente.nome,
                email: usuarioExistente.email,
            }),
        }
    }
}

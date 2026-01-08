import CasoDeUso from '../shared/CasoDeUso'
import Id from '../shared/Id'
import Usuario from '../usuario/Usuario'
import ColecaoTransacao from './ColecaoTransacao'
import Transacao from './Transacao'

export type Entrada = { transacao: Transacao; id: string; usuario: Usuario }

export default class SalvarTransacao implements CasoDeUso<Entrada, void> {
    constructor(private colecao: ColecaoTransacao) {}

    async executar(dto: Entrada): Promise<void> {
        if(dto.transacao.idUsuario !== dto.usuario.id) {
            throw new Error('Usuário não autorizado')
        }

        const transacao = {
            ...dto.transacao,
            id: dto.id ?? Id.gerar()
        }

        dto.id
            ? await this.colecao.atualizar(transacao)
            : await this.colecao.adicionar(transacao)
    }
}

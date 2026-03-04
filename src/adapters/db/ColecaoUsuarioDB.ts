import ColecaoUsuario from '../../core/usuario/ColecaoUsuario'
import Usuario from '../../core/usuario/Usuario'
import conexao from './conexao'

export default class ColecaoUsuarioDB implements ColecaoUsuario {
    async inserir(usuario: Usuario): Promise<void> {
        await conexao.table('usuarios').insert(usuario)
    }

    buscarPorEmail(email: string): Promise<Usuario | null> {
        return conexao.table('usuarios').where('email', email).first()
    }
}

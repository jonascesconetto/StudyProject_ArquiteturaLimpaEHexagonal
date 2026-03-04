import { Request, Response, NextFunction } from 'express'
import ColecaoUsuario from '../core/usuario/ColecaoUsuario'
import ProvedorToken from '../core/usuario/ProvedorToken'
import Usuario from '../core/usuario/Usuario'

export default function UsuarioMiddleware(
    colecao: ColecaoUsuario,
    provedorToken: ProvedorToken
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const acessoNegado = () => res.status(403).send('Token inválido')
        
        try {
            const token = req.headers.authorization?.replace('Bearer ', '')
            if (!token) {
                acessoNegado()
                return
            }

            const usuarioToken = provedorToken.validar(token) as Usuario
            const usuario = await colecao.buscarPorEmail(usuarioToken.email)

            if (!usuario) {
                acessoNegado()
                return
            }

            ;(req as any).usuario = usuario
            next()
        } catch (e) {
            acessoNegado()
        }
    }
}

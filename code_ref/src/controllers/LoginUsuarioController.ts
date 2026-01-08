import { Express } from 'express'
import LoginUsuario from '../core/usuario/LoginUsuario'

export default class LoginUsuarioController {
    constructor(
        private servidor: Express,
        private casoDeUso: LoginUsuario
    ) {
        servidor.post('/login', async (req, res) => {
            try {
                const resposta = await casoDeUso.executar({
                    email: req.body.email,
                    senha: req.body.senha
                })
                res.status(200).json(resposta)
            } catch (err: any) {
                res.status(403).send(err.message)
            }
        })
    }
}

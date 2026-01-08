import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import BcryptAdapter from './adapters/auth/BcryptAdapter'
import JwtAdapter from './adapters/auth/JwtAdaptar'
import ColecaoTransacaoDB from './adapters/db/ColecaoTransacaoDB'
import ColecaoUsuarioDB from './adapters/db/ColecaoUsuarioDB'
import LoginUsuarioController from './controllers/LoginUsuarioController'
import RegistrarUsuarioController from './controllers/RegistrarUsuarioController'
import SalvarTransacaoController from './controllers/SalvarTransacaoController'
import UsuarioMiddleware from './controllers/UsuarioMiddleware'
import SalvarTransacao from './core/transacao/SalvarTransacao'
import LoginUsuario from './core/usuario/LoginUsuario'
import RegistrarUsuario from './core/usuario/RegistrarUsuario'
import ExtratoMensal from './core/transacao/ExtratoMensal'
import ExtratoMensalController from './controllers/ExtratoMensalController'

const app = express()
const porta = process.env.PORTA ?? 3001
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.listen(porta, () => {
    console.log(`🔥 Server is running on port ${porta}`)
})

// ------------------------------------------ Rotas abertas

const provedorToken = new JwtAdapter(process.env.JWT_SECRET!)
const provedorCripto = new BcryptAdapter()
const colecaoUsuario = new ColecaoUsuarioDB()

const registrarUsuario = new RegistrarUsuario(colecaoUsuario, provedorCripto)
const loginUsuario = new LoginUsuario(
    colecaoUsuario,
    provedorCripto,
    provedorToken
)

new RegistrarUsuarioController(app, registrarUsuario)
new LoginUsuarioController(app, loginUsuario)

// ------------------------------------------ Rotas autenticadas
const usuarioMiddleware = UsuarioMiddleware(colecaoUsuario, provedorToken)

const colecaoTransacao = new ColecaoTransacaoDB

const salvarTransacao = new SalvarTransacao(colecaoTransacao)
const extratoMensal = new ExtratoMensal(colecaoTransacao)

new SalvarTransacaoController(app, salvarTransacao, usuarioMiddleware)
new ExtratoMensalController(app, extratoMensal, usuarioMiddleware)

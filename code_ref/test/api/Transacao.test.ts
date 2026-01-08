import axios from 'axios'
import transacoes from '../data/transacoes'
import { getAutorizationHeader } from '../util/auth'

const baseUrl = process.env.API_URL

test('Deve registrar um novo usuário se não existir', async () => {
    try {
        const headers = await getAutorizationHeader()
        const resp = await axios.post(
            `${baseUrl}/transacao`,
            transacoes.semId,
            headers
        )
        expect(resp.status).toBe(200)
    } catch (e: any) {
        console.log(e.response.data)
        expect(e.response.status).toBe(400)
    }
})

test('Deve alterar uma transacao por id', async () => {
    try {
        const headers = await getAutorizationHeader()
        const resp = await axios.post(
            `${baseUrl}/transacao/<transacao-id-aqui>`,
            { ...transacoes.semId, valor: -173.58 },
            headers
        )
        expect(resp.status).toBe(200)
    } catch (e: any) {
        console.log(e.response.data)
        expect(e.response.status).toBe(400)
    }
})

test('Deve popular com um lista de transações', async () => {
    try {
        const headers = await getAutorizationHeader()
        const respostas = transacoes.lista.map(async (transacao) => {
            const resp = await axios.post(
                `${baseUrl}/transacao`,
                transacao,
                headers
            )
            return resp.status
        })
        const listaDeStatus = await Promise.all(respostas)
        expect(listaDeStatus.every((s) => s === 200)).toBe(true)
    } catch (e: any) {
        console.log(e.response.data)
        expect(e.response.status).toBe(400)
    }
})

test('Deve retornar o extrato mensal + saldo consolidado', async () => {
    try {
        const headers = await getAutorizationHeader()
        const resp = await axios.get(`${baseUrl}/extrato/2021/1`, headers)
        expect(resp.status).toBe(200)
        expect(resp.data).toHaveProperty('transacoes')
        expect(resp.data).toHaveProperty('saldo')
    } catch (e: any) {
        console.log(e.response.data)
        expect(e.response.status).toBe(400)
    }
})

import transacoes from "../data/transacoes"
import Saldo from "../../src/core/transacao/Saldo"

const lista = [
    {...transacoes.semId, valor: 5000},
    {...transacoes.semId, valor: -300},
    {...transacoes.semId, valor: -700},
    {...transacoes.semId, valor: -1500},
]

test('Deve calcular total das transacoes', () => {
    expect(new Saldo(lista).total).toBe(2500)
})

test('Deve calcular total de receitas', () => {
    expect(new Saldo(lista).receitas).toBe(5000)
})

test('Deve calcular total de despesas', () => {
    expect(new Saldo(lista).despesas).toBe(-2500)
})
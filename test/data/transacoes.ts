import Transacao from "../../src/core/transacao/Transacao";

const transacaoRef = {
    descricao: 'Conta de luz',
    valor: -100,
    vencimento: new Date('2021-01-01'),
    idUsuario: '8448882d-4e1c-4ca3-ad1e-b31dc86d8529',
} as Transacao

export default {
    semId: transacaoRef,
    lista: [
        {...transacaoRef, valor: 5000, descricao: 'Salário'},
        {...transacaoRef, valor: -450, descricao: 'Conta de luz'},
        {...transacaoRef, valor: -100, descricao: 'Conta de água'},
        {...transacaoRef, valor: -250, descricao: 'Conta de telefone'},
    ]
}
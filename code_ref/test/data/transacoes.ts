import Transacao from "../../src/core/transacao/Transacao";

const transacaoRef = {
    descricao: 'Conta de luz',
    valor: -100,
    vencimento: new Date('2021-01-01'),
    idUsuario: '777a8a4a-51c7-4d70-b01e-08bab11cf7c6',
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
import CasoDeUso from '../shared/CasoDeUso'
import Usuario from '../usuario/Usuario'
import ColecaoTransacao from './ColecaoTransacao'
import Saldo, { SaldoDTO } from './Saldo'
import Transacao from './Transacao'

export type Entrada = { usuario: Usuario; ano: number; mes: number }
export type Saida = { transacoes: Transacao[]; saldo: SaldoDTO }

export default class ExtratoMensal implements CasoDeUso<Entrada, Saida> {
    constructor(private colecao: ColecaoTransacao) {}

    async executar(dto: Entrada): Promise<Saida> {
        const transacoes = await this.colecao.buscarPorMes(
            dto.usuario.id,
            dto.ano,
            dto.mes
        )

        return {
            transacoes,
            saldo: new Saldo(transacoes).dto,
        }
    }
}

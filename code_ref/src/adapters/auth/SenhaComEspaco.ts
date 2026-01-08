import ProvedorCriptografia from "../../core/usuario/ProvedorCriptografia";

export default class SenhaComEspaco implements ProvedorCriptografia {
    criptografar(senha: string): string {
        return senha.split('').join(' ')
    }

    comparar(senha: string, senhaCriptografada: string): boolean {
        const senhaFornecida = this.criptografar(senha)
        return senhaFornecida === senhaCriptografada
    }
}
import ProvedorToken from '../../core/usuario/ProvedorToken'
import jwt from 'jsonwebtoken'

export default class JwtAdapter implements ProvedorToken {
    constructor(private segredo: string) {}
    
    gerar(payload: string | object): string {
        return jwt.sign(payload, this.segredo, { expiresIn: '1d' })
    }

    validar(token: string): string | object {
        return jwt.verify(token, this.segredo)
    }
}

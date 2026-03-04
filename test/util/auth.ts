import usuarios from '../data/usuarios'
import axios from 'axios'

const baseUrl = process.env.API_URL

export async function getAutorizationHeader() {
    const resp = await axios.post(`${baseUrl}/login`, usuarios.completo)
    return {
        headers: {
            Authorization: `Bearer ${resp.data.token}`,
        },
    }
}

import { IKeyserverStrategy } from './IKeyserverStrategy';
import { fetchComTimeout } from '../utils/httpClient';

export class MailvelopeKeyserver implements IKeyserverStrategy {
    public nome = 'Mailvelope Keyserver';

    public async buscar(email: string): Promise<string | null> {
        console.log(`Buscando a chave de ${email} no ${this.nome}...`);

        try {
            const url = `https://keys.mailvelope.com/api/v1/key?email=${encodeURIComponent(email)}`;
            
            const response = await fetchComTimeout(url);

            if (!response.ok) {
                console.log(`⚠️ Chave não encontrada no ${this.nome} (Status: ${response.status})`);
                return null;
            }

            const data = await response.json();

            if (data && data.publicKeyArmored) {
                return data.publicKeyArmored.trim();
            }

            return null;

        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.warn(`⚠️ Timeout: O ${this.nome} demorou mais de 5 segundos e foi pulado.`);
            } else {
                console.error(`❌ Erro de conexão com o ${this.nome}:`, error.message);
            }
            return null;
        }
    }
}
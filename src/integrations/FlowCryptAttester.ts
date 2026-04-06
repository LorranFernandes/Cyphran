import { IKeyserverStrategy } from './IKeyserverStrategy';
import { fetchComTimeout } from '../utils/httpClient';

export class FlowCryptAttester implements IKeyserverStrategy {
    public nome = 'FlowCrypt Attester';

    public async buscar(email: string): Promise<string | null> {
        console.log(`Buscando a chave de ${email} no ${this.nome}...`);

        try {
            const url = `https://flowcrypt.com/attester/pub/${email}`;

            const response = await fetchComTimeout(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml'
                }
            });

            if (!response.ok) {
                console.log(`⚠️ Chave não encontrada no ${this.nome} (Status: ${response.status})`);
                return null;
            }

            const textoDaChave = await response.text();

            if (textoDaChave.includes('-----BEGIN PGP PUBLIC KEY BLOCK-----')) {
                return textoDaChave.trim();
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
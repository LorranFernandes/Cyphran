// src/integrations/UbuntuKeyserver.ts
import { IKeyserverStrategy } from './IKeyserverStrategy';
import { fetchComTimeout } from '../utils/httpClient'; // <-- 1. Importando o utilitário!

export class UbuntuKeyserver implements IKeyserverStrategy {
    public nome = 'Ubuntu Keyserver';

    public async buscar(email: string): Promise<string | null> {
        console.log(`Buscando índice de chaves para ${email} no ${this.nome}...`);

        try {
            const indexUrl = `https://keyserver.ubuntu.com/pks/lookup?op=index&search=${encodeURIComponent(email)}&options=mr`;
            
            const indexResponse = await fetchComTimeout(indexUrl);

            if (!indexResponse.ok) {
                console.log(`⚠️ Nenhum índice encontrado no ${this.nome}.`);
                return null;
            }

            const indexText = await indexResponse.text();
            
            let idChaveMaisRecente: string | null = null;
            let maiorData = 0;

            const linhas = indexText.split('\n');
            for (const linha of linhas) {
                if (linha.startsWith('pub:')) {
                    const partes = linha.split(':');
                    const keyId = partes[1];
                    const timestampCriacao = parseInt(partes[4], 10); 

                    if (timestampCriacao > maiorData) {
                        maiorData = timestampCriacao;
                        idChaveMaisRecente = keyId;
                    }
                }
            }

            if (!idChaveMaisRecente) {
                console.log(`⚠️ Nenhuma chave válida encontrada no índice.`);
                return null;
            }

            console.log(`✅ Chave mais recente encontrada: ${idChaveMaisRecente}. Baixando bloco...`);

            const getUrl = `https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x${idChaveMaisRecente}&options=mr`;
            
            const getResponse = await fetchComTimeout(getUrl);

            if (!getResponse.ok) {
                console.log(`⚠️ Chave não encontrada no ${this.nome} (Status: ${getResponse.status})`);
                return null;
            }

            const textoDaChave = await getResponse.text();

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
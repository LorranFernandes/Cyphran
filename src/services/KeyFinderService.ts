import { IKeyserverStrategy } from '../integrations/IKeyserverStrategy';
import { UbuntuKeyserver } from '../integrations/UbuntuKeyserver';
import { MitKeyserver } from '../integrations/MitKeyserver';
import { KeysOpenPgpServer } from '../integrations/KeysOpenPgpServer';
import { FlowCryptAttester } from '../integrations/FlowCryptAttester';
import { MailvelopeKeyserver } from '../integrations/MailvelopeKeyserver';
import { NotFoundError } from '../utils/AppErrors';
import * as openpgp from 'openpgp';

export class KeyFinderService {
    private provedores: IKeyserverStrategy[];

    constructor() {
        this.provedores = [
            new KeysOpenPgpServer(),
            new FlowCryptAttester(),
            new MailvelopeKeyserver(),
            //new UbuntuKeyserver(),
            //new MitKeyserver() // precisa ser testada depois
        ];
    }

    public async buscarChavesPorEmail(email: string) {
        const promessas = this.provedores.map(async (provedor) => {
            const chave = await provedor.buscar(email);
            if (chave) console.log(`✅ Chave encontrada com sucesso no provedor: ${provedor.nome}`);
            return { chaveStr: chave, provedorNome: provedor.nome };
        });

        const resultados = await Promise.allSettled(promessas);

        const resultadosBrutos = resultados
            .map(r => r.status === 'fulfilled' ? r.value : { chaveStr: null, provedorNome: '' })
            .filter(r => r.chaveStr !== null);

        if (resultadosBrutos.length === 0) {
            throw new NotFoundError(`Nenhuma chave pública encontrada para o e-mail: ${email}`);
        }

        const chavesValidas = new Map<string, { publicKey: string, sources: string[] }>();

        for (const item of resultadosBrutos) {
            try {
                const key = await openpgp.readKey({ armoredKey: item.chaveStr as string });
                const fingerprint = key.getFingerprint().toUpperCase();

                console.log(`🔑 Lendo Fingerprint: ${fingerprint} (Veio do ${item.provedorNome})`);

                if (chavesValidas.has(fingerprint)) {
                    // A chave já existe! Apenas adicionamos a nova fonte (Ex: FlowCrypt) na lista
                    chavesValidas.get(fingerprint)!.sources.push(item.provedorNome);
                } else {
                    // É uma chave nova, criamos o registro
                    chavesValidas.set(fingerprint, {
                        publicKey: item.chaveStr as string,
                        sources: [item.provedorNome]
                    });
                }
            } catch (error) {
                console.warn('⚠️ Falha ao fazer o parse de uma chave bruta. Ignorando.');
            }
        }

        const chavesFinais = Array.from(chavesValidas.values());

        if (chavesFinais.length === 0) {
             throw new NotFoundError(`Chaves encontradas, mas todas eram inválidas ou corrompidas.`);
        }

        return chavesFinais; 
    }
}
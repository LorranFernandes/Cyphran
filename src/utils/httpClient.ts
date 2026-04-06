/**
 * Função utilitária que encapsula o fetch nativo e adiciona um limite de tempo (timeout).
 * @param url A URL para fazer a requisição.
 * @param options Opções do fetch (headers, method, etc).
 * @param tempoMs O tempo limite em milissegundos (padrão: 5000ms = 5 segundos).
 */
export const fetchComTimeout = async (url: string, options: RequestInit = {}, tempoMs: number = 5000) => {
    const controller = new AbortController();
    const idDoCronometro = setTimeout(() => controller.abort(), tempoMs);

    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        
        clearTimeout(idDoCronometro);
        return response;
        
    } catch (error) {
        clearTimeout(idDoCronometro);
        throw error; 
    }
};
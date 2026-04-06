export interface ErroCampo {
    campo: string;
    mensagem: string;
}

export interface ErroResposta {
    statusCode: number;
    mensagem: string;
    erros?: ErroCampo[];
}
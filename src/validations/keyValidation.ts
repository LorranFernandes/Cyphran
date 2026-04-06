import { z } from 'zod';

export const buscarChaveSchema = z.object({
    email: z.email({
            error: "O formato do e-mail é inválido. Ex. usuario@dominio.com" 
        })
});
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod'; 
import { ValidationError } from '../utils/AppErrors';

export const validateRequest = <T extends z.ZodType>(schema: T) => {
    return (req: Request, res: Response, next: NextFunction) => {
        
        const result = schema.safeParse(req.query);
        
        if (!result.success) {
            const mensagemDeErro = result.error.issues[0].message;
            return next(new ValidationError(mensagemDeErro));
        }
        
        next();
    };
};
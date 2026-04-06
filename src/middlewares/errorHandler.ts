// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppErrors';

export const globalExceptionHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    console.error("🔥 Erro interno do servidor:", err); 
    
    return res.status(500).json({
        success: false,
        message: "Ocorreu um erro inesperado. Tente novamente mais tarde."
    });
};
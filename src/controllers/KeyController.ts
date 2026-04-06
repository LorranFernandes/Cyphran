import { Request, Response, NextFunction } from 'express';
import { KeyFinderService } from '../services/KeyFinderService';

export class KeyController {
    public async buscar(req: Request, res: Response, next: NextFunction) {
        try {
            const email = req.query.email as string;
            
            const keyService = new KeyFinderService();
            const chaveEncontrada = await keyService.buscarChavesPorEmail(email);

            return res.status(200).json({
                success: true,
                message: "Chave pública encontrada com sucesso.",
                data: chaveEncontrada
            });

        } catch (error) {
            next(error); 
        }
    }
}
import { Router } from 'express';
import { KeyController } from '../controllers/KeyController';
import { validateRequest } from '../middlewares/validateRequest';
import { buscarChaveSchema } from '../validations/keyValidation';

const router = Router();
const keyController = new KeyController();

/**
 * @swagger
 * /api/keys:
 *   get:
 *     summary: Busca a chave pública OpenPGP de um usuário
 *     description: >
 *       Recebe um endereço de e-mail e consulta em paralelo múltiplos
 *       servidores públicos de chave OpenPGP (keys.openpgp.org, FlowCrypt e MailVelope)
 *       para retornar todas as chaves públicas únicas encontradas, agrupadas por fingerprint.
 *     tags:
 *       - Keys
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         description: O endereço de e-mail exato para realizar a busca.
 *         schema:
 *           type: string
 *           format: email
 *         example: pessoa@exemplo.com
 *     responses:
 *       200:
 *         description: Chave(s) pública(s) encontrada(s) e retornada(s) com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Chave pública encontrada com sucesso.
 *                 data:
 *                   type: array
 *                   description: Lista de chaves únicas encontradas, agrupadas por fingerprint.
 *                   items:
 *                     type: object
 *                     properties:
 *                       publicKey:
 *                         type: string
 *                         description: Bloco ASCII armored da chave pública OpenPGP.
 *                         example: "-----BEGIN PGP PUBLIC KEY BLOCK-----\n...\n-----END PGP PUBLIC KEY BLOCK-----"
 *                       sources:
 *                         type: array
 *                         description: Lista de servidores onde essa chave foi encontrada.
 *                         items:
 *                           type: string
 *                         example: ["keys.openpgp.org"]
 *
 *       404:
 *         description: Nenhuma chave pública foi encontrada para o e-mail informado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Nenhuma chave encontrada para o e-mail informado.
 *
 *       422:
 *         description: Erro de validação. O e-mail enviado está em branco ou possui formato inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "O formato do e-mail é inválido. Ex. usuario@dominio.com"
 *
 *       500:
 *         description: Erro interno inesperado no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Ocorreu um erro inesperado. Tente novamente mais tarde."
 *
 */
router.get('/keys', validateRequest(buscarChaveSchema), keyController.buscar);

export default router;
import swaggerJsDoc, { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Keyserver Finder API',
            version: '1.0.0',
            description: 'API centralizada para descoberta e extração de chaves públicas OpenPGP através de múltiplos servidores (keys.openpgp.org, FlowCrypt, MailVelope, Ubuntu e MIT).',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3333}`,
                description: 'Servidor de Desenvolvimento Local'
            }
        ],
    },
    apis: ['./src/routes/*.ts'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;
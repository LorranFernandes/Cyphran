import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swagger';
import keyRoutes from './routes/KeyRoutes';
import { globalExceptionHandler } from './middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', keyRoutes);

// Middleware Global de Erros
app.use(globalExceptionHandler);

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📚 Documentação disponível em http://localhost:${PORT}/api-docs`);
});





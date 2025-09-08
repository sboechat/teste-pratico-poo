import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs/swagger.json';
import authSwagger from '../docs/auth.swagger.json';
import authRouter from './router/authRouter';
import taskRouter from './router/taskRouter';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRouter);

app.use('/api', taskRouter);

// Unindo docs de autenticação e docs principais
const mergedSwagger = {
  ...swaggerDocument,
  paths: { ...swaggerDocument.paths, ...authSwagger.paths }
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(mergedSwagger));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

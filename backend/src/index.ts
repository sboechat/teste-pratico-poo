import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { TaskRepositorySQLite } from './repositories/TaskRepositorySQLite';
import { TaskService } from './services/TaskService';
import { TaskController } from './controllers/TaskController';
import swaggerDocument from '../docs/swagger.json';

const app = express();
app.use(cors());
app.use(express.json());

const repo = new TaskRepositorySQLite();
const service = new TaskService(repo);
const controller = new TaskController(service);

app.post('/tarefas', (req, res) => controller.criar(req, res));
app.get('/tarefas', (req, res) => controller.listar(req, res));
app.get('/tarefas/status', (req, res) => controller.filtrarPorStatus(req, res));
app.patch('/tarefas/:id/status', (req, res) => controller.atualizarStatus(req, res));
app.delete('/tarefas/:id', (req, res) => controller.remover(req, res));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

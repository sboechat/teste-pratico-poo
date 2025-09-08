import { Router } from 'express';
import { TaskController } from '../controller/TaskController';
import { TaskService } from '../service/TaskService';
import { TaskRepositorySQLite } from '../repository/TaskRepositorySQLite';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const repo = new TaskRepositorySQLite();
const service = new TaskService(repo);
const controller = new TaskController(service);

router.use(authMiddleware);
router.post('/tarefas', controller.criar);
router.get('/tarefas', controller.listar);
router.get('/tarefas/status', controller.filtrarPorStatus);
router.patch('/tarefas/:id/status', controller.atualizarStatus);
router.delete('/tarefas/:id', controller.remover);

export default router;

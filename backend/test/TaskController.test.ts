// Defina o segredo JWT antes de qualquer import
process.env.JWT_SECRET = 'segredo';
import request from 'supertest';
import express, { Request, Response } from 'express';
import { TaskRepositorySQLite } from '../src/repository/TaskRepositorySQLite';
import { TaskService } from '../src/service/TaskService';
import { TaskController } from '../src/controller/TaskController';
import { UserRepositorySQLite } from '../src/repository/UserRepositorySQLite';
import { authMiddleware } from '../src/middlewares/authMiddleware';
import jwt from 'jsonwebtoken';

describe('TaskController', () => {
  let app: express.Express;
  let token: string;
  let userId: string;
  let id: string;
  const JWT_SECRET = process.env.JWT_SECRET || 'segredo';

  beforeAll(async () => {
    // Cria usuário e token antes de montar o app
    const userRepo = new UserRepositorySQLite();
    const login = 'ctrluser_' + Math.floor(Math.random() * 100000);
    const user = await userRepo.create({ login, senha: 'senha123' } as any);
    userId = user.id;
    token = jwt.sign({ sub: userId, login }, JWT_SECRET, { expiresIn: '1h' });
    await new Promise(resolve => setTimeout(resolve, 100));

    app = express();
    app.use(express.json());
    const repo = new TaskRepositorySQLite();
    const service = new TaskService(repo);
    const controller = new TaskController(service);
    app.use(authMiddleware);
    app.post('/tarefas', (req: Request, res: Response) => controller.criar(req, res));
    app.get('/tarefas', (req: Request, res: Response) => controller.listar(req, res));
    app.get('/tarefas/status', (req: Request, res: Response) => controller.filtrarPorStatus(req, res));
    app.patch('/tarefas/:id/status', (req: Request, res: Response) => controller.atualizarStatus(req, res));
    app.delete('/tarefas/:id', (req: Request, res: Response) => controller.remover(req, res));
  });

  it('não permite criar tarefa sem autenticação', async () => {
    const res = await request(app)
      .post('/tarefas')
      .send({ titulo: 'Teste', descricao: 'Descrição', status: 'pendente' });
    expect(res.status).toBe(401);
  });

  it('cria uma tarefa', async () => {
    const res = await request(app)
      .post('/tarefas')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Teste', descricao: 'Descrição', status: 'pendente' });
    expect(res.status).toBe(201);
    expect(res.body.titulo).toBe('Teste');
    expect(res.body.userId).toBe(userId);
    id = res.body.id;
  });

  it('não cria tarefa sem campos obrigatórios', async () => {
    const res = await request(app)
      .post('/tarefas')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: '', descricao: '', status: '' });
    expect(res.status).toBe(400);
  });

  it('lista tarefas', async () => {
    const res = await request(app)
      .get('/tarefas')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('filtra tarefas por status', async () => {
    const res = await request(app)
      .get('/tarefas/status?status=pendente')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) expect(res.body[0].status).toBe('pendente');
  });

  it('não filtra tarefas sem status', async () => {
    const res = await request(app)
      .get('/tarefas/status')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it('atualiza status da tarefa', async () => {
    const res = await request(app)
      .patch(`/tarefas/${id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'concluída' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('concluída');
  });

  it('não atualiza status de tarefa inexistente', async () => {
    const res = await request(app)
      .patch(`/tarefas/id_invalido/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'pendente' });
    expect(res.status).toBe(404);
  });

  it('remove tarefa', async () => {
    const res = await request(app)
      .delete(`/tarefas/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });

  it('não remove tarefa inexistente', async () => {
    const res = await request(app)
      .delete(`/tarefas/id_invalido`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});

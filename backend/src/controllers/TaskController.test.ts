import request from 'supertest';
import express from 'express';
import { TaskRepositorySQLite } from '../repositories/TaskRepositorySQLite';
import { TaskService } from '../services/TaskService';
import { TaskController } from './TaskController';

const app = express();
app.use(express.json());
const repo = new TaskRepositorySQLite(':memory:');
const service = new TaskService(repo);
const controller = new TaskController(service);
app.post('/tarefas', (req, res) => controller.criar(req, res));
app.get('/tarefas', (req, res) => controller.listar(req, res));
app.get('/tarefas/status', (req, res) => controller.filtrarPorStatus(req, res));
app.patch('/tarefas/:id/status', (req, res) => controller.atualizarStatus(req, res));
app.delete('/tarefas/:id', (req, res) => controller.remover(req, res));

describe('TaskController', () => {
  let id: string;

  it('deve criar uma tarefa', async () => {
    const res = await request(app)
      .post('/tarefas')
      .send({ titulo: 'Teste', descricao: 'Descrição', status: 'pendente' });
    expect(res.status).toBe(201);
    expect(res.body.titulo).toBe('Teste');
    id = res.body.id;
  });

  it('deve listar tarefas', async () => {
    const res = await request(app).get('/tarefas');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('deve filtrar tarefas por status', async () => {
    const res = await request(app).get('/tarefas/status?status=pendente');
    expect(res.status).toBe(200);
    expect(res.body[0].status).toBe('pendente');
  });

  it('deve atualizar status da tarefa', async () => {
    const res = await request(app)
      .patch(`/tarefas/${id}/status`)
      .send({ status: 'concluída' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('concluída');
  });

  it('deve remover tarefa', async () => {
    const res = await request(app).delete(`/tarefas/${id}`);
    expect(res.status).toBe(204);
  });
});

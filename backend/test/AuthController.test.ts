import request from 'supertest';
import express from 'express';
import { AuthController } from '../src/controller/AuthController';
import { AuthService } from '../src/service/AuthService';
import { UserRepositorySQLite } from '../src/repository/UserRepositorySQLite';

const app = express();
app.use(express.json());
const repo = new UserRepositorySQLite();
const service = new AuthService(repo);
const controller = new AuthController(service);
app.post('/login', (req, res) => controller.login(req, res));
app.post('/register', (req, res) => controller.register(req, res));

describe('AuthController', () => {
  const login = 'testctrl_' + Math.floor(Math.random() * 100000);
  const senha = 'senha123';
  let token: string;

  it('registra um novo usuário', async () => {
    const res = await request(app)
      .post('/register')
      .send({ login, senha });
    expect(res.status).toBe(201);
    expect(res.body.login).toBe(login);
    expect(res.body.id).toBeDefined();
  });

  it('não permite registrar login duplicado', async () => {
    const res = await request(app)
      .post('/register')
      .send({ login, senha });
    expect(res.status).toBe(400);
    expect(res.body.erro).toBeDefined();
  });

  it('faz login com usuário e senha corretos', async () => {
    const res = await request(app)
      .post('/login')
      .send({ login, senha });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('não faz login com senha errada', async () => {
    const res = await request(app)
      .post('/login')
      .send({ login, senha: 'errada' });
    expect(res.status).toBe(401);
    expect(res.body.erro).toBeDefined();
  });

  it('não faz login com usuário inexistente', async () => {
    const res = await request(app)
      .post('/login')
      .send({ login: 'naoexiste', senha: 'qualquer' });
    expect(res.status).toBe(401);
    expect(res.body.erro).toBeDefined();
  });
});

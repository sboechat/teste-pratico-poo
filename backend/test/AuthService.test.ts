import { AuthService } from '../src/service/AuthService';
import { UserRepositorySQLite } from '../src/repository/UserRepositorySQLite';

describe('AuthService', () => {
  let service: AuthService;
  let login = 'testuser_' + Math.floor(Math.random() * 100000);
  let senha = 'senha123';

  beforeAll(() => {
    const repo = new UserRepositorySQLite();
    service = new AuthService(repo);
  });

  it('registra um novo usuário', async () => {
    const user = await service.register(login, senha);
    expect(user.login).toBe(login);
    expect(user.id).toBeDefined();
  });

  it('não permite registrar login duplicado', async () => {
    await expect(service.register(login, senha)).rejects.toThrow();
  });

  it('faz login com usuário e senha corretos', async () => {
    const token = await service.login({ login, senha });
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(10);
  });

  it('não faz login com senha errada', async () => {
    await expect(service.login({ login, senha: 'errada' })).rejects.toThrow('Usuário ou senha inválidos');
  });

  it('não faz login com usuário inexistente', async () => {
    await expect(service.login({ login: 'naoexiste', senha: 'qualquer' })).rejects.toThrow('Usuário ou senha inválidos');
  });
});

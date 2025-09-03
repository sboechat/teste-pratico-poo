import { TaskService } from './TaskService';
import { TaskRepositorySQLite } from '../repositories/TaskRepositorySQLite';

describe('TaskService', () => {
  let service: TaskService;
  let id: string;

  beforeAll(async () => {
    const repo = new TaskRepositorySQLite(':memory:');
    service = new TaskService(repo);
    // Aguarda a criação da tabela
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  it('cria uma tarefa', async () => {
    const tarefa = await service.criar({ titulo: 'Teste', descricao: 'Desc', status: 'pendente' });
    expect(tarefa.titulo).toBe('Teste');
    id = tarefa.id;
  });

  it('lista tarefas', async () => {
    const tarefas = await service.listar();
    expect(Array.isArray(tarefas)).toBe(true);
    expect(tarefas.length).toBeGreaterThan(0);
  });

  it('filtra tarefas por status', async () => {
    const tarefas = await service.filtrarPorStatus('pendente');
    expect(tarefas[0].status).toBe('pendente');
  });

  it('atualiza status da tarefa', async () => {
    const tarefa = await service.atualizarStatus(id, 'concluída');
    expect(tarefa?.status).toBe('concluída');
  });

  it('remove tarefa', async () => {
    const ok = await service.remover(id);
    expect(ok).toBe(true);
  });
});

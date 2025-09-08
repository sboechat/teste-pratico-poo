import { TaskService } from '../src/service/TaskService';
import { TaskRepositorySQLite } from '../src/repository/TaskRepositorySQLite';
import { UserRepositorySQLite } from '../src/repository/UserRepositorySQLite';

describe('TaskService', () => {
	let service: TaskService;
	let userId: string;
	let id: string;

	beforeAll(async () => {
		const repo = new TaskRepositorySQLite();
		service = new TaskService(repo);
		// Cria usuário para os testes
		const userRepo = new UserRepositorySQLite();
		const login = 'taskuser_' + Math.floor(Math.random() * 100000);
		const user = await userRepo.create({ login, senha: 'senha123' } as any);
		userId = user.id;
		await new Promise(resolve => setTimeout(resolve, 100));
	});

	it('cria uma tarefa', async () => {
		const tarefa = await service.criar({ titulo: 'Teste', descricao: 'Desc', status: 'pendente', userId });
		expect(tarefa.titulo).toBe('Teste');
		expect(tarefa.userId).toBe(userId);
		id = tarefa.id;
	});

	it('não cria tarefa sem campos obrigatórios', async () => {
		await expect(service.criar({ titulo: '', descricao: '', status: '', userId } as any)).rejects.toThrow();
	});

	it('lista tarefas', async () => {
		const tarefas = await service.listar(userId);
		expect(Array.isArray(tarefas)).toBe(true);
		expect(tarefas.length).toBeGreaterThan(0);
	});

	it('filtra tarefas por status', async () => {
		const tarefas = await service.filtrarPorStatus('pendente', userId);
		expect(Array.isArray(tarefas)).toBe(true);
		if (tarefas.length > 0) expect(tarefas[0].status).toBe('pendente');
	});

	it('atualiza status da tarefa', async () => {
		const tarefa = await service.atualizarStatus(id, 'concluída', userId);
		expect(tarefa?.status).toBe('concluída');
	});

	it('não atualiza status de tarefa inexistente', async () => {
		const tarefa = await service.atualizarStatus('id_invalido', 'pendente', userId);
		expect(tarefa).toBeNull();
	});

	it('remove tarefa', async () => {
		await expect(service.remover(id, userId)).resolves.toBeUndefined();
	});

	it('não remove tarefa inexistente', async () => {
		await expect(service.remover('id_invalido', userId)).resolves.toBeUndefined();
	});
});

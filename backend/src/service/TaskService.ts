import { ITaskRepository } from '../repository/ITaskRepository';
import { Task } from '../entity/Task';
import { CreateTaskDTO } from '../dto/CreateTaskDTO';

export class TaskService {
  constructor(private repo: ITaskRepository) {}

  async criar(dto: CreateTaskDTO): Promise<Task> {
    // Validação básica
    if (!dto.titulo || !dto.descricao || !dto.status) {
      throw new Error('Campos obrigatórios ausentes.');
    }
    return this.repo.criar({ ...dto } as Task);
  }

  async listar(userId: string): Promise<Task[]> {
    return this.repo.listar(userId);
  }

  async filtrarPorStatus(status: string, userId: string): Promise<Task[]> {
    return this.repo.filtrarPorStatus(status, userId);
  }

  async atualizarStatus(id: string, status: string, userId: string): Promise<Task | null> {
    return this.repo.atualizarStatus(id, status, userId);
  }

  async remover(id: string, userId: string): Promise<void> {
    return this.repo.remover(id, userId);
  }
}

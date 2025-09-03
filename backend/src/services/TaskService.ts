import { Task, TaskStatus } from '../models/Task';
import { ITaskRepository } from '../interfaces/ITaskRepository';

export class TaskService {
  constructor(private repo: ITaskRepository) {}

  async criar(task: Omit<Task, 'id' | 'criadaEm'>): Promise<Task> {
    return await this.repo.criar(task);
  }

  async listar(): Promise<Task[]> {
    return await this.repo.listar();
  }

  async filtrarPorStatus(status: TaskStatus): Promise<Task[]> {
    return await this.repo.filtrarPorStatus(status);
  }

  async atualizarStatus(id: string, status: TaskStatus): Promise<Task | null> {
    return await this.repo.atualizarStatus(id, status);
  }

  async remover(id: string): Promise<boolean> {
    return await this.repo.remover(id);
  }
}

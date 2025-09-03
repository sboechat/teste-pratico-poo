import { Task, TaskStatus } from '../models/Task';

export interface ITaskRepository {
  criar(task: Omit<Task, 'id' | 'criadaEm'>): Promise<Task>;
  listar(): Promise<Task[]>;
  filtrarPorStatus(status: TaskStatus): Promise<Task[]>;
  atualizarStatus(id: string, status: TaskStatus): Promise<Task | null>;
  remover(id: string): Promise<boolean>;
}

import { Task } from '../entity/Task';

export interface IRepository {
  criar(task: Task): Promise<Task>;
  listar(userId: string): Promise<Task[]>;
  filtrarPorStatus(status: string, userId: string): Promise<Task[]>;
  atualizarStatus(id: string, status: string, userId: string): Promise<Task | null>;
  remover(id: string, userId: string): Promise<void>;
}

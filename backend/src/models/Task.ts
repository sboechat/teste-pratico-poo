export type TaskStatus = 'pendente' | 'em andamento' | 'concluída';

export interface Task {
  id: string;
  titulo: string;
  descricao: string;
  status: TaskStatus;
  criadaEm: string;
}

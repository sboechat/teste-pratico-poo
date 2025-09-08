export interface CreateTaskDTO {
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em andamento' | 'concluída';
  userId: string;
}

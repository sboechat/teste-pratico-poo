export class Task {
  id!: string;
  titulo!: string;
  descricao!: string;
  status!: 'pendente' | 'em andamento' | 'concluída';
  criadaEm!: string;
  userId!: string;
}

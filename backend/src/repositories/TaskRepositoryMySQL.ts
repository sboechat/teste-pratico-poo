import { Task, TaskStatus } from '../models/Task';
import { ITaskRepository } from '../interfaces/ITaskRepository';
import { v4 as uuidv4 } from 'uuid';
import mysql, { Connection } from 'mysql2';

export class TaskRepositoryMySQL implements ITaskRepository {
  private conn: Connection;

  constructor(config: mysql.ConnectionOptions) {
    this.conn = mysql.createConnection(config);
    this.conn.query(`CREATE TABLE IF NOT EXISTS tasks (
      id VARCHAR(36) PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      descricao TEXT NOT NULL,
      status VARCHAR(20) NOT NULL,
      criadaEm VARCHAR(30) NOT NULL
    )`);
  }

  async criar(task: Omit<Task, 'id' | 'criadaEm'>): Promise<Task> {
    const id = uuidv4();
    const criadaEm = new Date().toISOString();
    const nova: Task = { ...task, id, criadaEm };
    await this.conn.promise().query(
      'INSERT INTO tasks (id, titulo, descricao, status, criadaEm) VALUES (?, ?, ?, ?, ?)',
      [id, task.titulo, task.descricao, task.status, criadaEm]
    );
    return nova;
  }

  async listar(): Promise<Task[]> {
    const [rows] = await this.conn.promise().query('SELECT * FROM tasks');
    return rows as Task[];
  }

  async filtrarPorStatus(status: TaskStatus): Promise<Task[]> {
    const [rows] = await this.conn.promise().query('SELECT * FROM tasks WHERE status = ?', [status]);
    return rows as Task[];
  }

  async atualizarStatus(id: string, status: TaskStatus): Promise<Task | null> {
    await this.conn.promise().query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
    const [rows] = await this.conn.promise().query('SELECT * FROM tasks WHERE id = ?', [id]);
    const tarefa = (rows as Task[])[0];
    return tarefa || null;
  }

  async remover(id: string): Promise<boolean> {
    const [result]: any = await this.conn.promise().query('DELETE FROM tasks WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

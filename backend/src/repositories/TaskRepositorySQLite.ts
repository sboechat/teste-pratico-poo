import { Database, OPEN_READWRITE, OPEN_CREATE } from 'sqlite3';
import { Task, TaskStatus } from '../models/Task';
import { ITaskRepository } from '../interfaces/ITaskRepository';
import { v4 as uuidv4 } from 'uuid';

export class TaskRepositorySQLite implements ITaskRepository {
  private db: Database;

  constructor(dbPath = './tasks.db') {
    this.db = new Database(dbPath, OPEN_READWRITE | OPEN_CREATE, (err: Error | null) => {
      if (err) throw err;
      this.db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        status TEXT NOT NULL,
        criadaEm TEXT NOT NULL
      )`);
    });
  }

  criar(task: Omit<Task, 'id' | 'criadaEm'>): Promise<Task> {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const criadaEm = new Date().toISOString();
      const nova: Task = { ...task, id, criadaEm, status: task.status };
      this.db.run(
        'INSERT INTO tasks (id, titulo, descricao, status, criadaEm) VALUES (?, ?, ?, ?, ?)',
        [id, task.titulo, task.descricao, task.status, criadaEm],
        (err: Error | null) => {
          if (err) return reject(err);
          resolve(nova);
        }
      );
    });
  }

  listar(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM tasks', [], (err: Error | null, rows: any[]) => {
        if (err) return reject(err);
        resolve(rows.map(row => ({ ...row })));
      });
    });
  }

  filtrarPorStatus(status: TaskStatus): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM tasks WHERE status = ?', [status], (err: Error | null, rows: any[]) => {
        if (err) return reject(err);
        resolve(rows.map(row => ({ ...row })));
      });
    });
  }

  atualizarStatus(id: string, status: TaskStatus): Promise<Task | null> {
    return new Promise((resolve, reject) => {
      this.db.run('UPDATE tasks SET status = ? WHERE id = ?', [status, id], (err: Error | null) => {
        if (err) return reject(err);
        this.db.get('SELECT * FROM tasks WHERE id = ?', [id], (err2: Error | null, row: any) => {
          if (err2) return reject(err2);
          resolve(row ? { ...row } : null);
        });
      });
    });
  }

  remover(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM tasks WHERE id = ?', [id], function (this: any, err: Error | null) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      });
    });
  }
}

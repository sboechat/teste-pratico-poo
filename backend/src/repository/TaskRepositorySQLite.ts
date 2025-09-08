import { db } from '../db/sqlite';
import { Task } from '../entity/Task';
import { ITaskRepository } from './ITaskRepository';
import { v4 as uuidv4 } from 'uuid';

export class TaskRepositorySQLite implements ITaskRepository {
  async criar(task: Task): Promise<Task> {
    const id = uuidv4();
    const criadaEm = new Date().toISOString();
    const nova: Task = { ...task, id, criadaEm };
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO tasks (id, titulo, descricao, status, criadaEm, userId) VALUES (?, ?, ?, ?, ?, ?)',
        [id, task.titulo, task.descricao, task.status, criadaEm, task.userId],
        err => {
          if (err) return reject(err);
          resolve(nova);
        }
      );
    });
  }

  async listar(userId: string): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tasks WHERE userId = ?', [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows as Task[]);
      });
    });
  }

  async filtrarPorStatus(status: string, userId: string): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM tasks WHERE status = ? AND userId = ?', [status, userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows as Task[]);
      });
    });
  }

  async atualizarStatus(id: string, status: string, userId: string): Promise<Task | null> {
    return new Promise((resolve, reject) => {
      db.run('UPDATE tasks SET status = ? WHERE id = ? AND userId = ?', [status, id, userId], err => {
        if (err) return reject(err);
        db.get('SELECT * FROM tasks WHERE id = ? AND userId = ?', [id, userId], (err2, row) => {
          if (err2) return reject(err2);
          resolve(row ? (row as Task) : null);
        });
      });
    });
  }

  async remover(id: string, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM tasks WHERE id = ? AND userId = ?', [id, userId], err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

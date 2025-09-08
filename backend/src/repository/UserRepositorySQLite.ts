import { db } from '../db/sqlite';
import { User } from '../entity/User';
import { v4 as uuidv4 } from 'uuid';

export class UserRepositorySQLite {
  async findByLogin(login: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE login = ?', [login], (err, row) => {
        if (err) return reject(err);
        resolve(row ? (row as User) : null);
      });
    });
  }

  async create(user: User): Promise<User> {
    const id = uuidv4();
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (id, login, senha) VALUES (?, ?, ?)',
        [id, user.login, user.senha],
        err => {
          if (err) return reject(err);
          resolve({ ...user, id });
        }
      );
    });
  }
}

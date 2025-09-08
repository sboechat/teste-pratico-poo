import sqlite3 from 'sqlite3';
export const db = new sqlite3.Database('tasks.db');

// Cria a tabela 'users' se não existir
db.run(`CREATE TABLE IF NOT EXISTS users (
	id TEXT PRIMARY KEY,
	login TEXT UNIQUE NOT NULL,
	senha TEXT NOT NULL
);`);

// Cria a tabela 'tasks' se não existir (agora com userId)
db.run(`CREATE TABLE IF NOT EXISTS tasks (
	id TEXT PRIMARY KEY,
	titulo TEXT NOT NULL,
	descricao TEXT NOT NULL,
	status TEXT NOT NULL,
	criadaEm TEXT NOT NULL,
	userId TEXT NOT NULL,
	FOREIGN KEY (userId) REFERENCES users(id)
);`);

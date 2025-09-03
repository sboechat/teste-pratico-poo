import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import './App.css';

export type Task = {
  id: string;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em andamento' | 'concluída';
  criadaEm: string;
};

const API_URL = 'http://localhost:3001';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>('');

  const fetchTasks = async () => {
    try {
      const url = filter ? `${API_URL}/tarefas/status?status=${filter}` : `${API_URL}/tarefas`;
      const res = await axios.get(url);
      setTasks(res.data);
    } catch (err) {
      alert('Erro ao buscar tarefas');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const handleCreate = async (titulo: string, descricao: string, status: string) => {
    try {
      await axios.post(`${API_URL}/tarefas`, { titulo, descricao, status });
      fetchTasks();
    } catch {
      alert('Erro ao criar tarefa');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await axios.patch(`${API_URL}/tarefas/${id}/status`, { status });
      fetchTasks();
    } catch {
      alert('Erro ao atualizar status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/tarefas/${id}`);
      fetchTasks();
    } catch {
      alert('Erro ao excluir tarefa');
    }
  };

  return (
    <div className="container">
      <h1>Gestão de Tarefas</h1>
      <TaskForm onCreate={handleCreate} />
      <div className="filter">
        <label>Filtrar por status:</label>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">Todos</option>
          <option value="pendente">Pendente</option>
          <option value="em andamento">Em andamento</option>
          <option value="concluída">Concluída</option>
        </select>
      </div>
      <TaskList tasks={tasks} onStatusChange={handleStatusChange} onDelete={handleDelete} />
    </div>
  );
}

export default App;

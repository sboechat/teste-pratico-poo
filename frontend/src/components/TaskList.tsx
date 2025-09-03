import React from 'react';
import { Task } from '../App';

interface Props {
  tasks: Task[];
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

const statusOptions = ['pendente', 'em andamento', 'concluída'];

const TaskList: React.FC<Props> = ({ tasks, onStatusChange, onDelete }) => (
  <table className="task-table">
    <thead>
      <tr>
        <th>Título</th>
        <th>Descrição</th>
        <th>Status</th>
        <th>Criada em</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      {tasks.map(task => (
        <tr key={task.id}>
          <td>{task.titulo}</td>
          <td>{task.descricao}</td>
          <td>
            <select value={task.status} onChange={e => onStatusChange(task.id, e.target.value)}>
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </td>
          <td>{new Date(task.criadaEm).toLocaleString()}</td>
          <td>
            <button onClick={() => onDelete(task.id)}>Excluir</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default TaskList;

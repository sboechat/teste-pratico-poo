import React, { useState } from 'react';

interface Props {
  onCreate: (titulo: string, descricao: string, status: string) => void;
}

const TaskForm: React.FC<Props> = ({ onCreate }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState('pendente');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !descricao) return;
    onCreate(titulo, descricao, status);
    setTitulo('');
    setDescricao('');
    setStatus('pendente');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={e => setTitulo(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={e => setDescricao(e.target.value)}
        required
      />
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="pendente">Pendente</option>
        <option value="em andamento">Em andamento</option>
        <option value="concluída">Concluída</option>
      </select>
      <button type="submit">Criar Tarefa</button>
    </form>
  );
};

export default TaskForm;

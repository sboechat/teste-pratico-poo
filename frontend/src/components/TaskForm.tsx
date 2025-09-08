import React, { useState } from "react";
import { TextField, Select, MenuItem, Box, Button, Stack } from '@mui/material';

interface TaskFormProps {
  onSubmit: (task: { titulo: string; descricao: string; status: string }) => void;
  initialData?: { titulo: string; descricao: string; status: string };
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const [titulo, setTitulo] = useState(initialData?.titulo || '');
  const [descricao, setDescricao] = useState(initialData?.descricao || '');
  const [status, setStatus] = useState(initialData?.status || 'pendente');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !descricao) return;
    onSubmit({ titulo, descricao, status });
    setTitulo('');
    setDescricao('');
    setStatus('pendente');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
      <Stack spacing={2}>
        <TextField
          label="Título"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          required
          fullWidth
          inputProps={{ maxLength: 80 }}
        />
        <TextField
          label="Descrição"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          required
          fullWidth
          multiline
          minRows={5}
          maxRows={8}
        />
        <Select
          value={status}
          onChange={e => setStatus(e.target.value)}
          fullWidth
          size="medium"
        >
          <MenuItem value="pendente">Pendente</MenuItem>
          <MenuItem value="em andamento">Em andamento</MenuItem>
          <MenuItem value="concluída">Concluída</MenuItem>
        </Select>
        <Box display="flex" justifyContent="flex-end" gap={2} mt={1}>
          {onCancel && (
            <Button variant="outlined" color="secondary" onClick={onCancel}>Cancelar</Button>
          )}
          <Button variant="contained" color="primary" type="submit">Criar Tarefa</Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default TaskForm;

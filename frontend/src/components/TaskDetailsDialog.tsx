import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from '@mui/material';
import { Task } from '../App';

interface Props {
  open: boolean;
  task: Task | null;
  onClose: () => void;
}

const TaskDetailsDialog: React.FC<Props> = ({ open, task, onClose }) => {
  if (!task) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Detalhes da Tarefa</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" fontWeight={600}>Título:</Typography>
        <Typography mb={1}>{task.titulo}</Typography>
        <Typography variant="subtitle1" fontWeight={600}>Descrição:</Typography>
        <Typography mb={1}>{task.descricao}</Typography>
        <Typography variant="subtitle1" fontWeight={600}>Status:</Typography>
        <Typography mb={1}>{task.status}</Typography>
        <Typography variant="subtitle1" fontWeight={600}>Criada em:</Typography>
        <Typography>{new Date(task.criadaEm).toLocaleString()}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailsDialog;

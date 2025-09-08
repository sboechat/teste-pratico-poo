
import React, { useState } from 'react';
import { Task } from '../App';
import { Box, Paper, Typography, IconButton, MenuItem, Select, Stack, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskDetailsDialog from './TaskDetailsDialog';

interface Props {
  tasks: Task[];
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onlyStatus?: string;
}

import { useTheme, alpha } from '@mui/material/styles';

const statusColumns = [
  { key: 'pendente', label: 'Pendente', colorLight: 'warning.light', colorDark: 'warning.dark' },
  { key: 'em andamento', label: 'Em andamento', colorLight: 'info.light', colorDark: 'info.dark' },
  { key: 'concluída', label: 'Concluída', colorLight: 'success.light', colorDark: 'success.dark' },
];


const TaskList: React.FC<Props> = ({ tasks, onStatusChange, onDelete, onlyStatus }) => {
  const theme = useTheme();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getCardBg = (col: typeof statusColumns[number]) => {
    // Use theme palette for background, with alpha for subtlety
    const base = theme.palette.mode === 'dark' ? theme.palette[col.colorDark.split('.')[0]].dark : theme.palette[col.colorLight.split('.')[0]].light;
    return alpha(base, theme.palette.mode === 'dark' ? 0.7 : 0.85);
  };

  const getCardTextColor = () => theme.palette.getContrastText(theme.palette.background.paper);

  const handleOpen = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };
  const handleClose = () => {
    setDialogOpen(false);
    setSelectedTask(null);
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'auto', mt: 4, minHeight: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
        }}
      >
  {(onlyStatus ? statusColumns.filter(col => col.key === onlyStatus) : statusColumns).map(col => (
          <Box key={col.key} sx={{ flex: 1, minWidth: 0 }}>
            <Paper elevation={4} sx={{ p: 2, minHeight: 400, bgcolor: 'background.paper' }}>
              <Typography variant="h6" mb={2} align="center" fontWeight={700} color="text.secondary">
                {col.label}
              </Typography>
              <Stack spacing={2}>
                {tasks.filter(t => t.status === col.key).map(task => (
                  <Paper
                    key={task.id}
                    elevation={6}
                    sx={{
                      p: 2,
                      bgcolor: getCardBg(col),
                      color: getCardTextColor(),
                      cursor: 'pointer',
                      borderRadius: 2,
                      boxShadow: 6,
                      minHeight: 120,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      transition: 'transform 0.1s',
                      '&:hover': { transform: 'scale(1.03)' },
                    }}
                    onClick={() => handleOpen(task)}
                  >
                    <Typography variant="subtitle1" fontWeight={600} noWrap>{task.titulo}</Typography>
                    <Typography variant="body2" color={theme.palette.mode === 'dark' ? 'grey.200' : 'grey.800'} noWrap>{task.descricao}</Typography>
                    <Box mt={1} display="flex" alignItems="center" justifyContent="space-between">
                      <Select
                        size="small"
                        value={task.status}
                        onChange={e => { e.stopPropagation(); onStatusChange(task.id, e.target.value); }}
                        sx={{ bgcolor: theme.palette.mode === 'dark' ? '#222' : '#fff', borderRadius: 1, fontWeight: 600 }}
                        onClick={e => e.stopPropagation()}
                      >
                        {statusColumns.map(opt => (
                          <MenuItem key={opt.key} value={opt.key}>{opt.label}</MenuItem>
                        ))}
                      </Select>
                      <Tooltip title="Excluir">
                        <IconButton size="small" color="error" onClick={e => { e.stopPropagation(); onDelete(task.id); }}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Box>
        ))}
      </Box>
      <TaskDetailsDialog open={dialogOpen} task={selectedTask} onClose={handleClose} />
    </Box>
  );
};

export default TaskList;

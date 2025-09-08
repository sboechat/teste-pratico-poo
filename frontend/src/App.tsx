

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import Zoom from '@mui/material/Zoom';
import { MenuItem, Select, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import TaskForm from './components/TaskForm';
import AuthForm from './components/AuthForm';
import { ThemeProvider, createTheme, CssBaseline, Container, AppBar, Toolbar, Typography, IconButton, Switch, Box, Button } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export type Task = {
  id: string;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em andamento' | 'concluída';
  criadaEm: string;
};

const API_URL = 'http://localhost:3001/api';


function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [darkMode, setDarkMode] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
      background: {
        default: darkMode ? '#181a1b' : '#f4f6fa',
        paper: darkMode ? '#23272f' : '#fff',
      },
    },
    shape: { borderRadius: 12 },
    shadows: [
      'none',
      '0 2px 8px rgba(0,0,0,0.08)', '0 2px 8px rgba(0,0,0,0.08)', '0 2px 8px rgba(0,0,0,0.08)', 
      '0 2px 8px rgba(0,0,0,0.08)', '0 2px 8px rgba(0,0,0,0.08)', '0 2px 8px rgba(0,0,0,0.08)', 
      '0 2px 8px rgba(0,0,0,0.08)', '0 2px 8px rgba(0,0,0,0.08)', '0 2px 8px rgba(0,0,0,0.08)', 
      '0 2px 8px rgba(0,0,0,0.08)', '0 2px 8px rgba(0,0,0,0.08)', '0 2px 8px rgba(0,0,0,0.08)', 
      '0 2px 8px rgba(0,0,0,0.08)', '0 2px 8px rgba(0,0,0,0.08)', '0 2px 8px rgba(0,0,0,0.08)', 
      '0 2px 8px rgba(0,0,0,0.08)', '0 2px 8px rgba(0,0,0,0.08)', '0 2px 8px rgba(0,0,0,0.08)', 
      '0 2px 8px rgba(0,0,0,0.08)', '0 2px 8px rgba(0,0,0,0.08)', '0 2px 8px rgba(0,0,0,0.08)', 
      '0 2px 8px rgba(0,0,0,0.08)', '0 2px 8px rgba(0,0,0,0.08)', '0 2px 8px rgba(0,0,0,0.08)'
    ],
  }), [darkMode]);

  const fetchTasks = async () => {
    try {
      const url = filter ? `${API_URL}/tarefas/status?status=${filter}` : `${API_URL}/tarefas`;
      const res = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setTasks(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setToken(null);
        localStorage.removeItem('token');
      } else {
        alert('Erro ao buscar tarefas');
      }
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [filter, token]);

  const handleCreate = async (titulo: string, descricao: string, status: string) => {
    try {
      await axios.post(`${API_URL}/tarefas`, { titulo, descricao, status }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchTasks();
    } catch (err: any) {
      if (err.response?.status === 401) {
        setToken(null);
        localStorage.removeItem('token');
      } else {
        alert('Erro ao criar tarefa');
      }
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await axios.patch(`${API_URL}/tarefas/${id}/status`, { status }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchTasks();
    } catch (err: any) {
      if (err.response?.status === 401) {
        setToken(null);
        localStorage.removeItem('token');
      } else {
        alert('Erro ao atualizar status');
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/tarefas/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      fetchTasks();
    } catch (err: any) {
      if (err.response?.status === 401) {
        setToken(null);
        localStorage.removeItem('token');
      } else {
        alert('Erro ao excluir tarefa');
      }
    }

  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box minHeight="100vh" bgcolor="background.default">
        <AppBar position="static" color="primary" enableColorOnDark>
          <Toolbar>
            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 900, letterSpacing: 2, whiteSpace: 'pre-line' }}>
              Lista de Tarefas
            </Typography>
            <IconButton sx={{ ml: 1 }} color="inherit" onClick={() => setDarkMode(m => !m)}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Button color="inherit" onClick={() => { setToken(null); localStorage.removeItem('token'); }}>Sair</Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ py: 4, minHeight: 'calc(100vh - 64px)' }}>
          {!token ? (
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="calc(100vh - 64px)">
              <AuthForm onAuth={setToken} />
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, mt: 2 }}>
                <FormControl fullWidth variant="outlined" size="small" sx={{ maxWidth: 320 }}>
                  <InputLabel id="status-filter-label">Filtrar por status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={filter}
                    label="Filtrar por status"
                    onChange={e => setFilter(e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="pendente">Pendente</MenuItem>
                    <MenuItem value="em andamento">Em andamento</MenuItem>
                    <MenuItem value="concluída">Concluída</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    whiteSpace: { xs: 'normal', sm: 'nowrap' },
                    fontWeight: 700,
                    boxShadow: 3,
                    px: { xs: 1.5, sm: 3 },
                    py: 1,
                    fontSize: { xs: '0.95rem', sm: '1rem' },
                    maxWidth: { xs: '100%', sm: 'auto' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  onClick={() => setShowForm(true)}
                >
                  Criar tarefa
                </Button>
              </Box>
              <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="sm" fullWidth TransitionComponent={Zoom}>
                <DialogTitle>Criar tarefa</DialogTitle>
                <DialogContent>
                  <TaskForm
                    onSubmit={({ titulo, descricao, status }) => {
                      handleCreate(titulo, descricao, status);
                      setShowForm(false);
                    }}
                    onCancel={() => setShowForm(false)}
                  />
                </DialogContent>
              </Dialog>
              <TaskList
                tasks={filter ? tasks.filter(t => t.status === filter) : tasks}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onlyStatus={filter || undefined}
              />
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
export default App;

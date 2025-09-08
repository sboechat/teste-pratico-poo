
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Alert, Stack } from '@mui/material';

interface Props {
  onAuth: (token: string) => void;
}

const API_URL = 'http://localhost:3001/api';

const AuthForm: React.FC<Props> = ({ onAuth }) => {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/login`, { login, senha });
        onAuth(res.data.token);
      } else {
        await axios.post(`${API_URL}/register`, { login, senha });
        setIsLogin(true);
        setSuccess('Usuário registrado com sucesso! Faça login.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.erro || err.message || '';
      if (msg.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed: users.login')) {
        setError('Este nome de usuário já está em uso. Por favor, escolha outro.');
      } else if (err.response?.data?.erro) {
        setError(err.response.data.erro);
      } else {
        setError('Erro ao autenticar');
      }
    }
  };

  return (
    <Box
      sx={{
        minWidth: 340,
        maxWidth: 380,
        p: 4,
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5" mb={2} fontWeight={600} textAlign="center">
        {isLogin ? 'Login' : 'Registrar'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <Stack spacing={2} mb={2}>
          <TextField
            label="Usuário"
            value={login}
            onChange={e => setLogin(e.target.value)}
            fullWidth
            required
            autoFocus
          />
          <TextField
            label="Senha"
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            fullWidth
            required
          />
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="primary" type="submit">
            {isLogin ? 'Entrar' : 'Registrar'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
            sx={{ color: '#fff' }}
          >
            {isLogin ? 'Criar conta' : 'Já tenho conta'}
          </Button>
        </Stack>
      </Box>
      {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{success}</Alert>}
    </Box>
  );
};

export default AuthForm;

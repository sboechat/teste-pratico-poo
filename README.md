# Lista de Tarefas

Sistema web para gerenciamento de tarefas, com backend Node.js (Express, SQLite) e frontend React.

## Instalação e Execução

### Pré-requisitos
- Node.js >= 18
- npm

### Backend
```bash
cd backend
npm install
npm run dev
```
O backend estará disponível em http://localhost:3001

### Frontend
```bash
cd frontend
npm install
npm run dev
```
O frontend estará disponível em http://localhost:5173

## Principais Classes e Funções

- **Task**: Modelo de tarefa (`src/entity/Task.ts`)
- **ITaskRepository**: Interface do repositório de tarefas (`src/repository/ITaskRepository.ts`)
- **TaskRepositorySQLite**: Implementação do repositório usando SQLite (`src/repository/TaskRepositorySQLite.ts`)
- **TaskService**: Lógica de negócio das tarefas (`src/service/TaskService.ts`)
- **TaskController**: Controlador das rotas da API (`src/controller/TaskController.ts`)
- **App**: Componente principal do frontend (`frontend/src/App.tsx`)

## Autenticação
A API utiliza autenticação JWT. Para acessar as rotas protegidas, envie o token no header:

```
Authorization: Bearer <seu_token>
```

Para obter um token, utilize a rota `/api/login`.

## Exemplos de Uso do CRUD

### Registrar Usuário
```bash
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{"login": "usuario1", "senha": "123456"}'
```

### Login
```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"login": "usuario1", "senha": "123456"}'
```

### Criar Tarefa
```bash
curl -X POST http://localhost:3001/api/tarefas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu_token>" \
  -d '{"titulo": "Tarefa 1", "descricao": "Primeira tarefa", "status": "pendente"}'
```

### Listar Tarefas
```bash
curl -H "Authorization: Bearer <seu_token>" http://localhost:3001/api/tarefas
```

### Filtrar Tarefas por Status
```bash
curl -H "Authorization: Bearer <seu_token>" "http://localhost:3001/api/tarefas/status?status=pendente"
```

### Atualizar Status de Tarefa
```bash
curl -X PATCH http://localhost:3001/api/tarefas/{id}/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu_token>" \
  -d '{"status": "concluída"}'
```

### Remover Tarefa
```bash
curl -X DELETE http://localhost:3001/api/tarefas/{id} \
  -H "Authorization: Bearer <seu_token>"
```

## Documentação da API
Acesse [http://localhost:3001/api-docs](http://localhost:3001/api-docs) para visualizar e testar os endpoints via Swagger.

---

Projeto desenvolvido para avaliação técnica. Para dúvidas ou sugestões, entre em contato.

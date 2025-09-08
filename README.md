# Gestão de Tarefas

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

- **Task**: Modelo de tarefa (`src/models/Task.ts`)
- **ITaskRepository**: Interface do repositório de tarefas (`src/interfaces/ITaskRepository.ts`)
- **TaskRepositorySQLite**: Implementação do repositório usando SQLite (`src/repositories/TaskRepositorySQLite.ts`)
- **TaskService**: Lógica de negócio das tarefas (`src/services/TaskService.ts`)
- **TaskController**: Controlador das rotas da API (`src/controllers/TaskController.ts`)
- **App**: Componente principal do frontend (`frontend/src/App.tsx`)

## Exemplos de Uso do CRUD

### Criar Tarefa
```bash
curl -X POST http://localhost:3001/tarefas \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Tarefa 1", "descricao": "Primeira tarefa", "status": "pendente"}'

curl -X POST http://localhost:3001/tarefas \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Tarefa 2", "descricao": "Segunda tarefa", "status": "em andamento"}'

curl -X POST http://localhost:3001/tarefas \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Tarefa 3", "descricao": "Terceira tarefa", "status": "concluída"}'
```

### Listar Tarefas
```bash
curl http://localhost:3001/tarefas

# Listar tarefas filtrando por status concluída
curl "http://localhost:3001/tarefas/status?status=concluída"
```

### Filtrar Tarefas por Status
```bash
curl "http://localhost:3001/tarefas/status?status=pendente"
```

### Atualizar Status de Tarefa
```bash
curl -X PATCH http://localhost:3001/tarefas/{id}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "concluída"}'

# Atualizar status para em andamento
curl -X PATCH http://localhost:3001/tarefas/{id}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "em andamento"}'
```

### Remover Tarefa
```bash
curl -X DELETE http://localhost:3001/tarefas/{id}
```

## Documentação da API
Acesse [http://localhost:3001/api-docs](http://localhost:3001/api-docs) para visualizar e testar os endpoints via Swagger.

---

Projeto desenvolvido para avaliação técnica. Para dúvidas ou sugestões, entre em contato.

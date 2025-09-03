import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { TaskStatus } from '../models/Task';

export class TaskController {
  constructor(private service: TaskService) {}

  criar = async (req: Request, res: Response) => {
    const { titulo, descricao, status } = req.body;
    if (!titulo || !descricao || !status) {
      return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
    }
    const tarefa = await this.service.criar({ titulo, descricao, status });
    res.status(201).json(tarefa);
  };

  listar = async (_: Request, res: Response) => {
    const tarefas = await this.service.listar();
    res.json(tarefas);
  };

  filtrarPorStatus = async (req: Request, res: Response) => {
    const { status } = req.query;
    if (!status) return res.status(400).json({ erro: 'Status não informado.' });
    const tarefas = await this.service.filtrarPorStatus(status as TaskStatus);
    res.json(tarefas);
  };

  atualizarStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const tarefa = await this.service.atualizarStatus(id, status);
    if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    res.json(tarefa);
  };

  remover = async (req: Request, res: Response) => {
    const { id } = req.params;
    const ok = await this.service.remover(id);
    if (!ok) return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    res.status(204).send();
  };
}

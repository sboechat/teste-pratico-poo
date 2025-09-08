import { Request, Response } from 'express';
import { TaskService } from '../service/TaskService';

export class TaskController {
  constructor(private service: TaskService) {}

  criar = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.sub;
      if (!userId) return res.status(401).json({ erro: 'Usuário não autenticado' });
      const tarefa = await this.service.criar({ ...req.body, userId });
      res.status(201).json(tarefa);
    } catch (err: any) {
      res.status(400).json({ erro: err.message });
    }
  };

  listar = async (req: Request, res: Response) => {
    const userId = (req as any).user?.sub;
    if (!userId) return res.status(401).json({ erro: 'Usuário não autenticado' });
    const tarefas = await this.service.listar(userId);
    res.json(tarefas);
  };

  filtrarPorStatus = async (req: Request, res: Response) => {
    const { status } = req.query;
    const userId = (req as any).user?.sub;
    if (!userId) return res.status(401).json({ erro: 'Usuário não autenticado' });
    if (!status) return res.status(400).json({ erro: 'Status não informado.' });
    const tarefas = await this.service.filtrarPorStatus(status as string, userId);
    res.json(tarefas);
  };

  atualizarStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = (req as any).user?.sub;
    if (!userId) return res.status(401).json({ erro: 'Usuário não autenticado' });
    const tarefa = await this.service.atualizarStatus(id, status, userId);
    if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    res.json(tarefa);
  };

  remover = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user?.sub;
    if (!userId) return res.status(401).json({ erro: 'Usuário não autenticado' });
    await this.service.remover(id, userId);
    res.status(204).send();
  };
}

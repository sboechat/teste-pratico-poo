import { Request, Response } from 'express';
import { AuthService } from '../service/AuthService';

export class AuthController {
  constructor(private service: AuthService) {}

  login = async (req: Request, res: Response) => {
    try {
      const token = await this.service.login(req.body);
      res.json({ token });
    } catch (err: any) {
      res.status(401).json({ erro: err.message });
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const { login, senha } = req.body;
      const user = await this.service.register(login, senha);
      res.status(201).json({ id: user.id, login: user.login });
    } catch (err: any) {
      res.status(400).json({ erro: err.message });
    }
  };
}

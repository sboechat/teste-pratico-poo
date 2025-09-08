import { UserRepositorySQLite } from '../repository/UserRepositorySQLite';
import { LoginDTO } from '../dto/LoginDTO';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../entity/User';

const JWT_SECRET = process.env.JWT_SECRET || 'segredo';

export class AuthService {
  constructor(private userRepo: UserRepositorySQLite) {}

  async login(dto: LoginDTO): Promise<string> {
    const user = await this.userRepo.findByLogin(dto.login);
    if (!user) throw new Error('Usuário ou senha inválidos');
    const valid = await bcrypt.compare(dto.senha, user.senha);
    if (!valid) throw new Error('Usuário ou senha inválidos');
    return jwt.sign({ sub: user.id, login: user.login }, JWT_SECRET, { expiresIn: '1h' });
  }

  async register(login: string, senha: string): Promise<User> {
    const hash = await bcrypt.hash(senha, 10);
    return this.userRepo.create({ login, senha: hash } as User);
  }
}

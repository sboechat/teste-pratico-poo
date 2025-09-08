import { Router } from 'express';
import { AuthController } from '../controller/AuthController';
import { AuthService } from '../service/AuthService';
import { UserRepositorySQLite } from '../repository/UserRepositorySQLite';

const router = Router();
const userRepo = new UserRepositorySQLite();
const service = new AuthService(userRepo);
const controller = new AuthController(service);

router.post('/login', controller.login);
router.post('/register', controller.register);

export default router;

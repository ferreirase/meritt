/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import CreateSessionService from '../services/CreateSessionService';

// Responsabilidades do arquivo de rotas:
// - receber uma requisição, chamar outro arquivo, devolver uma resposta.
// Tudo o que foge disso deve ser abstraído num service.

const sessionsRoutes = Router();

// rota de criação de novo agendamento
sessionsRoutes.post('/', async (request, response) => {
  console.log('Method: POST - Route: /sessions');
  const { email, password } = request.body;

  const createSessionService = new CreateSessionService();

  const { user, token } = await createSessionService.execute({
    email,
    password,
  });

  delete user.password;

  return response.json({ user, token });
});

export default sessionsRoutes;

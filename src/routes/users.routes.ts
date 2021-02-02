/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';
import CreateUserService from '../services/CreateUserService';
import UpdateAvatarUserService from '../services/UpdateUserAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

// Responsabilidades do arquivo de rotas:
// - receber uma requisição, chamar outro arquivo, devolver uma resposta.
// Tudo o que foge disso deve ser abstraído num service.

const usersRouter = Router();
const upload = multer(uploadConfig);

// rota de criação de novo usuário
usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService();
  const newUser = await createUser.execute({ name, email, password });

  delete newUser.password;

  return response.status(201).json(newUser);
});

// rota para update de avatar de usuário
usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = new UpdateAvatarUserService();

    const userUpdated = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });

    delete userUpdated.password;

    return response.status(200).json(userUpdated);
  },
);

export default usersRouter;

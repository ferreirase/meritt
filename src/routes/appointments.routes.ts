/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { parseISO } from 'date-fns';
import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

// Responsabilidades do arquivo de rotas:
// - receber uma requisição, chamar outro arquivo, devolver uma resposta.
// Tudo o que foge disso deve ser abstraído num service.

const appointmentsRouter = Router();

// middleware de autenticação
appointmentsRouter.use(ensureAuthenticated);

// rota de criação de novo agendamento
appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;

  const parsedDate = parseISO(date);

  const createAppointment = new CreateAppointmentService();

  const newAppointment = await createAppointment.execute({
    date: parsedDate,
    provider_id,
  });

  return response.status(201).json(newAppointment);
});

// rota que busca todos os agendamentos
appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();
  return response.status(200).json({ appointments });
});

export default appointmentsRouter;

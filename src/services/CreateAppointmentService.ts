/* eslint-disable camelcase */
import { startOfHour } from 'date-fns';
import { getCustomRepository, getRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import User from '../models/User';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import AppError from '../errors/AppError';

/* Princípio SOLID - Single Responsability Principle: Cada service deve fazer
 apenas 1 coisa.
 Deve ter apenas um método.
 O service nunca tem acesso ao request/response do Express,
 por isso a tratativa de erros deve ser enviar como um novo throw Error */

interface Request {
  date: Date;
  provider_id: string;
}

class CreateAppointmentService {
  /**
   * Princípio SOLID - Dependency Invertion: toda vez que minha classe depender
   * de alguma instância de outra classe externa, receberá essa instância no
   * constructor como parâmetro.
   */

  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    const appointmentDate = startOfHour(date); // regra de negócio
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const usersRepository = getRepository(User);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError({ message: 'Date unavailable', statusCode: 401 });
    }

    const provider = await usersRepository.findOne({
      where: {
        id: provider_id,
      },
    });

    if (!provider) {
      throw new AppError({ message: 'Provider not found', statusCode: 401 });
    }

    const newAppointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(newAppointment);

    return newAppointment;
  }
}

export default CreateAppointmentService;

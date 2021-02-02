import { EntityRepository, Repository } from 'typeorm';
import Appointment from '../models/Appointment';

// informando de qual entidade é esse repository, no caso, Appointment
@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  public async findByDate(date: Date): Promise<Appointment | null> {
    const findAppointment = await this.findOne({
      where: { date },
    });

    return findAppointment || null;
  }
}

export default AppointmentsRepository;

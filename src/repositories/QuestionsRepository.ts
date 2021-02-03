import { EntityRepository, Repository, getRepository } from 'typeorm';
import Question from '../models/Question';
import Exam from '../models/Exam';
import AppError from '../errors/AppError';
import shuffleArray from '../functions/shuffleArray';

@EntityRepository(Question)
class QuestionsRepository extends Repository<Question> {
  public async findByQuestion(exam_id: string): Promise<Object | null> {
    const examRepository = getRepository(Exam);

    try {
      const examExists = await examRepository.findOne({
        where: {
          id: exam_id,
        },
      });

      if (!examExists) {
        throw new AppError({ message: 'Exam not found', statusCode: 400 });
      }

      const questions = await this.createQueryBuilder('question')
        .where('question.exam_id = :id', { id: exam_id })
        .select(['question.id', 'question.statement'])
        .addSelect([
          'option.id',
          'option.key',
          'option.value',
          'option.correct',
        ])
        .leftJoin('question.options', 'option')
        .getMany();

      return (
        {
          exam_id,
          statement: questions[0].statement,
          questions: shuffleArray(questions[0].options),
        } || null
      );
    } catch (error) {
      throw new AppError({ message: `${error.message}`, statusCode: 400 });
    }
  }
}

export default QuestionsRepository;

/* eslint-disable array-callback-return */
import { Router, Request, Response } from 'express';
import * as Yup from 'yup';
import { getRepository } from 'typeorm';
import CreateExamService from '../services/Exams/CreateExamService';
import UpdateExamService from '../services/Exams/UpdateExamService';
import AppError from '../errors/AppError';
import Exam from '../models/Exam';
import QuestionInterface from '../interfaces/question';

interface QuestionReturn extends QuestionInterface {
  created_at?: Date;
  updated_at?: Date;
  exam_id?: string;
}

const examRoutes = Router();

examRoutes.get('/', async (_: Request, res: Response) => {
  const examRepository = getRepository(Exam);

  try {
    const exams: Array<Exam> = await examRepository.find({
      select: ['id', 'name', 'description', 'type'],
      relations: ['questions', 'questions.options'],
    });

    exams.map(exam =>
      exam.questions.map((question: QuestionReturn) => {
        delete question.created_at;
        delete question.updated_at;
        delete question.exam_id;
      }),
    );

    return res.status(200).json({
      exams,
    });
  } catch (error) {
    throw new AppError({ message: `${error.message}`, statusCode: 400 });
  }
});

examRoutes.post('/', async (req: Request, res: Response) => {
  const schema = Yup.object().shape({
    name: Yup.string().required('Name field is required'),
    description: Yup.string().required('Description field is required'),
    type: Yup.string().required('Type field is required'),
  });

  await schema.isValid(req.body).then(valid => {
    if (!valid) {
      throw new AppError({ message: 'Check fields submited', statusCode: 404 });
    }
  });

  const createExam = new CreateExamService();

  const newExam = await createExam.execute({
    name: req.body?.name,
    description: req.body?.description,
    type: req.body?.type,
    questions: [],
  });

  return res.status(200).json(newExam);
});

examRoutes.put('/', async (req: Request, res: Response) => {
  const updateExam = new UpdateExamService();

  const schema = Yup.object().shape({
    exam_id: Yup.string().required('Exam ID is required'),
    name: Yup.string().required('Name field is required'),
    description: Yup.string().required('Description field is required'),
    type: Yup.string().required('Type field is required'),
  });

  await schema.isValid(req.body).then(valid => {
    if (!valid) {
      throw new AppError({ message: 'Check fields submited', statusCode: 404 });
    }
  });

  const updatedExam = await updateExam.execute(
    {
      name: req.body?.name,
      description: req.body?.description,
      type: req.body?.type,
      questions: [],
    },
    req.body?.exam_id,
  );

  return res.status(200).json(updatedExam);
});

export default examRoutes;

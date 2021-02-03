/* eslint-disable array-callback-return */
import { Router, Request, Response } from 'express';
import * as Yup from 'yup';
import { getRepository } from 'typeorm';
import CreateExamService from '../services/Exams/CreateExamService';
import UpdateExamService from '../services/Exams/UpdateExamService';
import DeleteExamService from '../services/Exams/DeleteExamService';
import AppError from '../errors/AppError';
import Exam from '../models/Exam';

const examRoutes = Router();

examRoutes.get('/', async (_: Request, res: Response) => {
  try {
    const exams = await getRepository(Exam)
      .createQueryBuilder('exam')
      .select(['exam.id', 'exam.name', 'exam.description', 'exam.type'])
      .addSelect(['question.id', 'question.statement'])
      .addSelect(['option.id', 'option.key', 'option.value', 'option.correct'])
      .leftJoin('exam.questions', 'question')
      .leftJoin('question.options', 'option')
      .getMany();

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

examRoutes.delete('/', async (req: Request, res: Response) => {
  const deleteExam = new DeleteExamService();

  const schema = Yup.object().shape({
    exam_id: Yup.string().required('Exam ID is required'),
  });

  await schema.isValid(req.body).then(valid => {
    if (!valid) {
      throw new AppError({ message: 'Check fields submited', statusCode: 404 });
    }
  });

  const examDeleted = await deleteExam.execute(req.body?.exam_id);

  return res.status(200).json(examDeleted);
});

export default examRoutes;

/* eslint-disable array-callback-return */
import { Router, Request, Response } from 'express';
import * as Yup from 'yup';
import { getRepository } from 'typeorm';
import Question from '../models/Question';
import QuestionInterface from '../interfaces/question';
import CreateQuestionService from '../services/Questions/CreateQuestionService';
import UpdateQuestionService from '../services/Questions/UpdateQuestionService';
import AppError from '../errors/AppError';

const questionRoutes = Router();

questionRoutes.get('/', async (_: Request, res: Response) => {
  const questionRepository = getRepository(Question);

  try {
    const questions: Array<Question> = await questionRepository.find({
      select: ['id', 'statement'],
    });

    return res.status(200).json({
      questions,
    });
  } catch (error) {
    throw new AppError({ message: `${error.message}`, statusCode: 400 });
  }
});

questionRoutes.post('/', async (req: Request, res: Response) => {
  const schema = Yup.object().shape({
    exam_id: Yup.string().required('Exam ID is required'),
    statement: Yup.string().required('Statement field is required'),
  });

  await schema.isValid(req.body).then(valid => {
    if (!valid) {
      throw new AppError({ message: 'Check fields submited', statusCode: 404 });
    }
  });

  const cretateQuestion = new CreateQuestionService();

  const newQuestion: QuestionInterface = await cretateQuestion.execute({
    exam_id: req.body?.exam_id,
    statement: req.body?.statement,
    options: [],
  });

  return res.status(200).json(newQuestion);
});

questionRoutes.put('/', async (req: Request, res: Response) => {
  const updateQuestion = new UpdateQuestionService();

  const schema = Yup.object().shape({
    question_id: Yup.string().required('Question ID is required'),
    exam_id: Yup.string().required('Exam ID is required'),
    statement: Yup.string().required('Statement field is required'),
  });

  await schema.isValid(req.body).then(valid => {
    if (!valid) {
      throw new AppError({ message: 'Check fields submited', statusCode: 404 });
    }
  });

  const questionUpdated = await updateQuestion.execute(
    req.body?.question_id,
    req.body?.exam_id,
    {
      statement: req.body?.statement,
    },
  );

  return res.status(200).json(questionUpdated);
});

export default questionRoutes;

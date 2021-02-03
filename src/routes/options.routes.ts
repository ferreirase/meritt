/* eslint-disable array-callback-return */
import { Router, Request, Response } from 'express';
import * as Yup from 'yup';
import { getRepository } from 'typeorm';
import Option from '../models/Option';
import OptionInterface from '../interfaces/option';
import CreateOptionService from '../services/Options/CreateOptionService';
import AppError from '../errors/AppError';

const optionRoutes = Router();

optionRoutes.get('/', async (_: Request, res: Response) => {
  const optionRepository = getRepository(Option);

  try {
    const questions: Array<Option> = await optionRepository.find({
      select: ['id', 'key', 'value', 'correct'],
    });

    return res.status(200).json({
      questions,
    });
  } catch (error) {
    throw new AppError({ message: `${error.message}`, statusCode: 400 });
  }
});

optionRoutes.post('/', async (req: Request, res: Response) => {
  const schema = Yup.object().shape({
    question_id: Yup.string().required('Question ID is required'),
    key: Yup.string().required('Key field is required'),
    value: Yup.string().required('Value field is required'),
    correct: Yup.boolean().required('Correct field is required'),
  });

  await schema.isValid(req.body).then(valid => {
    if (!valid) {
      throw new AppError({ message: 'Check fields submited', statusCode: 404 });
    }
  });

  const cretateQuestion = new CreateOptionService();

  const newOption: OptionInterface = await cretateQuestion.execute({
    question_id: req.body?.question_id,
    key: req.body?.key,
    value: req.body?.value,
    correct: req.body?.correct,
  });

  return res.status(200).json(newOption);
});

export default optionRoutes;

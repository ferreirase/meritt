import { Router } from 'express';
import examRoutes from './exams.routes';
import questionRoutes from './questions.routes';
import optionRoutes from './options.routes';

const routes = Router();

routes.use('/exams', examRoutes);
routes.use('/questions', questionRoutes);
routes.use('/options', optionRoutes);

export default routes;

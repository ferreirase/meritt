import { Router } from 'express';
import examRoutes from './exams.routes';
import questionRoutes from './questions.routes';

const routes = Router();

routes.use('/exams', examRoutes);
routes.use('/questions', questionRoutes);

export default routes;

import { Router } from 'express';
import examRoutes from './exams.routes';

const routes = Router();

routes.use('/exams', examRoutes);

export default routes;

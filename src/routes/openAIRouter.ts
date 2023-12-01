import express, { Router } from 'express';
import { askGepeto } from '../controller/openAIController';

const openAIRouter: Router = express.Router();

openAIRouter.post('/openai', askGepeto);

export default openAIRouter;
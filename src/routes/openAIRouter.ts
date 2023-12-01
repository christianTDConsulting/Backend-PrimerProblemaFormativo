import express, { Router } from 'express';
import { askGepeto,  createConversacion } from '../controller/openAIController';

const openAIRouter: Router = express.Router();

openAIRouter.post('/openai', askGepeto); 
openAIRouter.post('/conversacion', createConversacion);  

export default openAIRouter;
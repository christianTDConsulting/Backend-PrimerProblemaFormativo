import express, { Router } from 'express';
import { askGepeto,  createGepetoConversacion, getMensajessByConversacionId } from '../controller/openAIController';

const openAIRouter: Router = express.Router();

openAIRouter.post('/openai', askGepeto);
openAIRouter.get('/mensajes/:id', getMensajessByConversacionId);
openAIRouter.post('/conversacion', createGepetoConversacion);  

export default openAIRouter;
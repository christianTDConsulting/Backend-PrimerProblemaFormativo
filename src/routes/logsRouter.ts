import express, { Router } from 'express';
import { getBloqueos, verLogs } from '../controller/logController';

const logsRouter:Router = express.Router();


logsRouter.get('/logs', verLogs); //obtiene logs

logsRouter.get('/bloqueos', getBloqueos); //bloqueos


export default logsRouter
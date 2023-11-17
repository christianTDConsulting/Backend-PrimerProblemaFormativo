import express, { Router } from 'express';
import { getApiKey, updateMunicipioInfo } from '../controller/metereologiaController';

const MetereoRouter:Router = express.Router();

MetereoRouter.get('/apiKey',getApiKey);
MetereoRouter.get('/addInfo/:codigo',updateMunicipioInfo);
export default MetereoRouter;
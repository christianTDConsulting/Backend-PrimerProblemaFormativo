import express, { Router } from 'express';
import { getAllArticulos } from '../controller/articuloController';

const articuloRouter: Router = express.Router();

articuloRouter.get('/articulos', getAllArticulos);

export default articuloRouter;

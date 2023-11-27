import express, { Router } from 'express';
import { 
   insertarEmpresas,
   getEmpresas,
} from '../controller/empresasAsociadasController'; // Importa el servicio de cliente

const empresaRouter: Router = express.Router();

empresaRouter.post('/empresas_asociadas/', insertarEmpresas);

empresaRouter.get('/empresas_asociadas', getEmpresas);

export default empresaRouter;


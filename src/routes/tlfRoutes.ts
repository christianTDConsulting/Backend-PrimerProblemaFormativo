import express, { Router } from 'express';
import {
  getAllTelefonos,
  getCliente,
  crearTelefono,
  deleteTelefono,
  editTelefonos
} from '../controller/tlfController'; // Importa el servicio de cliente

const tlfRouter: Router = express.Router();

tlfRouter.get('/telefonos', getAllTelefonos);
tlfRouter.get('/telefonos/:numero/cliente', getCliente);
tlfRouter.post('/telefonos', crearTelefono);
tlfRouter.delete('/telefonos', deleteTelefono);
tlfRouter.put('/telefonos', editTelefonos);

export default tlfRouter;

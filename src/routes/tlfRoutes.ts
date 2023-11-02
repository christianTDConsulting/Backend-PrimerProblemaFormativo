import express, { Router } from 'express';
import {
  getAllTelefonos,
  getCliente,
  crearTelefono,
  deleteTelefono,
  editTelefonos,
  toggleVisibility,
  getAllVisibleTelefonos,
  getVisibleTelefonosFromCliente
} from '../controller/tlfController'; // Importa el servicio de cliente


const tlfRouter: Router = express.Router();

tlfRouter.get('/telefonos', getAllTelefonos);

tlfRouter.get('/telefonos/:id/cliente', getCliente);

tlfRouter.post('/telefonos', crearTelefono);

tlfRouter.delete('/telefonos', deleteTelefono);

tlfRouter.put('/telefonos', editTelefonos);

tlfRouter.put('/telefonos/:id', toggleVisibility);

tlfRouter.get('/visible/telefonos/:visible', getAllVisibleTelefonos);
tlfRouter.get('/visible/telefonos/:id/:visible', getVisibleTelefonosFromCliente);

export default tlfRouter;

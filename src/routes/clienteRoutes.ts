import express, { Router } from 'express';
import {
  getAllClientes,
  getClienteById,
  crearCliente,
  deleteClientes,
  getTlf,
  editarCliente,
  toggleVisibility,
  getAllClientesVisible,
  
} from '../controller/clienteController'; // Importa el servicio de cliente




const clienteRouter: Router = express.Router();

clienteRouter.get('/clientes', getAllClientes);

clienteRouter.get('/clientes/:id', getClienteById);

clienteRouter.post('/clientes', crearCliente);

clienteRouter.delete('/clientes', deleteClientes);

clienteRouter.get('/clientes/:id/telefonos', getTlf);

clienteRouter.put('/clientes', editarCliente);

clienteRouter.post('/clienteVisible', toggleVisibility); //cambiar a post

clienteRouter.get('/visible/clientes/:visible', getAllClientesVisible);




export default clienteRouter;

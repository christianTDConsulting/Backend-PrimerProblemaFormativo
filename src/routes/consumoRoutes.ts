import express, { Router } from 'express';
import { 
    getAllConsumo, 
    getConsumoById, 
    crearConsumo, 
    deleteConsumo, 
    getConsumoClientes, 
    getConsumoTelefonos, 
    getConsumoAnual,
    updateConsumo

} from '../controller/consumoController'; // Importa el servicio de cliente

const consumoRouter: Router = express.Router();

consumoRouter.get('/consumos', getAllConsumo);

consumoRouter.get('/consumos/:id', getConsumoById);

consumoRouter.post('/consumos', crearConsumo);

consumoRouter.delete('/consumos', deleteConsumo);

consumoRouter.get('/consumos/clientes/:cliente', getConsumoClientes);

consumoRouter.get('/consumos/telefonos/:telefono', getConsumoTelefonos);

consumoRouter.get('/consumosAnual/', getConsumoAnual);

consumoRouter.put('/consumos',updateConsumo)



export default consumoRouter;

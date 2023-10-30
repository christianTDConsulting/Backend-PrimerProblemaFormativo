"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const consumoController_1 = require("../controller/consumoController"); // Importa el servicio de cliente
const consumoRouter = express_1.default.Router();
consumoRouter.get('/consumos', consumoController_1.getAllConsumo);
consumoRouter.get('/consumos/:id', consumoController_1.getConsumoById);
consumoRouter.post('/consumos', consumoController_1.crearConsumo);
consumoRouter.delete('/consumos', consumoController_1.deleteConsumo);
consumoRouter.get('/consumos/clientes/:cliente', consumoController_1.getConsumoClientes);
consumoRouter.get('/consumos/telefonos/:telefono', consumoController_1.getConsumoTelefonos);
consumoRouter.get('/consumosAnual/', consumoController_1.getConsumoAnual);
consumoRouter.put('/consumos/', consumoController_1.updateConsumo);
consumoRouter.get('/mediaMaxMinConsumo/:telefono', consumoController_1.getMediaMaxMinConsumo);
consumoRouter.get('/consumos/clientedata/:consumo', consumoController_1.getCliente);
exports.default = consumoRouter;

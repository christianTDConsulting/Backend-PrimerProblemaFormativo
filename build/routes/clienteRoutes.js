"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clienteController_1 = require("../controller/clienteController"); // Importa el servicio de cliente
const clienteRouter = express_1.default.Router();
clienteRouter.get('/clientes', clienteController_1.getAllClientes);
clienteRouter.get('/clientes/:id', clienteController_1.getClienteById);
clienteRouter.post('/clientes', clienteController_1.crearCliente);
clienteRouter.delete('/clientes', clienteController_1.deleteClientes);
clienteRouter.get('/clientes/:id/telefonos', clienteController_1.getTlf);
clienteRouter.put('/clientes', clienteController_1.editarCliente);
exports.default = clienteRouter;

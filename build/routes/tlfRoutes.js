"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tlfController_1 = require("../controller/tlfController"); // Importa el servicio de cliente
const tlfRouter = express_1.default.Router();
tlfRouter.get('/telefonos', tlfController_1.getAllTelefonos);
tlfRouter.get('/telefonos/:numero/cliente', tlfController_1.getCliente);
tlfRouter.post('/telefonos', tlfController_1.crearTelefono);
tlfRouter.delete('/telefonos', tlfController_1.deleteTelefono);
tlfRouter.put('/telefonos', tlfController_1.editTelefonos);
exports.default = tlfRouter;

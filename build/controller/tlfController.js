"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editTelefonos = exports.deleteTelefono = exports.crearTelefono = exports.getCliente = exports.getAllTelefonos = void 0;
const tlfService_1 = require("../service/tlfService");
const clienteService_1 = require("../service/clienteService");
function getAllTelefonos(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const telefonos = yield (0, tlfService_1.getAllTelefonosService)();
            console.log(telefonos);
            res.status(200).json(telefonos); // Retorna todos los teléfonos encontrados
        }
        catch (error) {
            console.error('Error al obtener teléfonos');
            res.status(500).json(error);
        }
    });
}
exports.getAllTelefonos = getAllTelefonos;
function getCliente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            console.log(id);
            const telefono = yield (0, tlfService_1.getTelefonoByNumberIdService)(parseInt(id));
            if (!telefono) {
                res.status(404).json({ error: 'Teléfono no encontrado' });
            }
            else {
                const cliente = yield (0, clienteService_1.getClienteByIdService)(telefono.id_cliente);
                res.status(200).json(cliente); // Devuelve el cliente
            }
        }
        catch (error) {
            console.error('Error al obtener cliente', error);
            res.status(500).json(error);
        }
    });
}
exports.getCliente = getCliente;
function crearTelefono(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { numero, cliente } = req.body; // Suponiendo que el número y el cliente se envían en el cuerpo de la solicitud
            const clienteExistente = yield (0, clienteService_1.getClienteByIdService)(cliente);
            if (!clienteExistente) {
                res.status(404).json({ error: 'Cliente no encontrado' });
            }
            const newTlf = yield (0, tlfService_1.createTelefonoService)(numero, cliente);
            res.status(201).json(newTlf); // Devuelve el teléfono recién creado como respuesta JSON
        }
        catch (error) {
            console.error('Error al crear el teléfono:', error);
            res.status(500).json(error);
        }
    });
}
exports.crearTelefono = crearTelefono;
function deleteTelefono(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.body; // Suponiendo que el número se envía en el cuerpo de la solicitud
            const deletedTLF = yield (0, tlfService_1.deleteTelefonoService)(id);
            if (deletedTLF) {
                res.status(200).json({ message: 'Teléfono eliminado con éxito' });
            }
            else {
                res.status(404).json({ error: 'Teléfono no encontrado' });
            }
        }
        catch (error) {
            console.error('Error al eliminar el teléfono:', error);
            res.status(500).json({ error: 'Error al eliminar el teléfono' });
        }
    });
}
exports.deleteTelefono = deleteTelefono;
function editTelefonos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tlfActualizado = req.body; // Suponiendo que el número se envío en el cuerpo de la solicitud
            //Verifica si el telefono existe
            const telefonoExistente = yield (0, tlfService_1.getTelefonoByNumberIdService)(tlfActualizado.id);
            if (!telefonoExistente) {
                res.status(404).json({ error: 'Telefono no encontrado' });
            }
            //Actualiza el telefono 
            const updatedCliente = yield (0, tlfService_1.editTelefonosService)(tlfActualizado);
            res.status(404).json(updatedCliente);
        }
        catch (error) {
            console.error('Error al editar el telefono:', error);
            res.status(500).json({ error: 'Error al editar el telefono' });
        }
    });
}
exports.editTelefonos = editTelefonos;

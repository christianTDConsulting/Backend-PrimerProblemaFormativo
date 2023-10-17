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
exports.editarCliente = exports.getTlf = exports.deleteClientes = exports.crearCliente = exports.getClienteById = exports.getAllClientes = void 0;
const clienteService_1 = require("../service/clienteService");
// Obtener todos los clientes
function getAllClientes(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const clientes = yield (0, clienteService_1.getAllClientesService)();
            console.log(clientes);
            res.status(200).json(clientes); // Retorna todos los clientes encontrados
        }
        catch (error) {
            console.error('Error al obtener clientes');
            res.status(500).json(error);
        }
    });
}
exports.getAllClientes = getAllClientes;
// Obtener un cliente por ID
function getClienteById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const clienteId = parseInt(req.params.id);
            const cliente = yield (0, clienteService_1.getClienteByIdService)(clienteId);
            if (!cliente) {
                res.status(404).json({ error: 'Cliente no encontrado' });
            }
            console.log('Cliente obtenido con éxito');
            res.status(200).json(cliente); // Envía el cliente como respuesta JSON
        }
        catch (error) {
            console.error('Error al obtener cliente ', error);
            res.status(500).json(error);
        }
    });
}
exports.getClienteById = getClienteById;
// Crear un nuevo cliente
function crearCliente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { nombre } = req.body; // Suponiendo que el nombre se envía en el cuerpo de la solicitud
            const newClient = yield (0, clienteService_1.createClienteService)(nombre);
            res.status(201).json(newClient); // Devuelve el cliente recién creado como respuesta JSON
        }
        catch (error) {
            console.error('Error al crear el cliente:', error);
            res.status(500).json(error);
        }
    });
}
exports.crearCliente = crearCliente;
// Eliminar cliente por ID
function deleteClientes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.body; // Suponiendo que el ID se envía en el cuerpo de la solicitud
            // Intenta eliminar el cliente
            const deletedClient = yield (0, clienteService_1.deleteClienteService)(id);
            if (deletedClient) {
                res.status(200).json({ message: 'Cliente eliminado con éxito' });
            }
            else {
                res.status(404).json({ error: 'Cliente no encontrado' });
            }
        }
        catch (error) {
            console.error('Error al eliminar el cliente:', error);
            res.status(500).json({ error: 'Error al eliminar el cliente' });
        }
    });
}
exports.deleteClientes = deleteClientes;
// Obtener lista de teléfonos de un ID
function getTlf(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const clienteId = parseInt(req.params.id);
            console.log(clienteId);
            // Lista de teléfonos
            const tlf = yield (0, clienteService_1.getTelefonosService)(clienteId);
            res.status(200).json(tlf); // Lista de teléfonos
        }
        catch (error) {
            console.error(error, 'Error al obtener teléfonos');
            res.status(500).json(error);
        }
    });
}
exports.getTlf = getTlf;
function editarCliente(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id, nombre } = req.body; // Suponiendo que el ID y el nuevo número se envían en el cuerpo de la solicitud
            // Verifica si el cliente existe
            const clienteExistente = yield (0, clienteService_1.getClienteByIdService)(id);
            if (!clienteExistente) {
                res.status(404).json({ error: 'Cliente no encontrado' });
            }
            // Actualiza el cliente
            const updatedCliente = yield (0, clienteService_1.editarClienteService)(id, nombre);
            res.status(200).json(updatedCliente); // Devuelve el cliente actualizado como respuesta JSON
        }
        catch (error) {
            console.error('Error al editar el cliente:', error);
            res.status(500).json({ error: 'Error al editar el cliente' });
        }
    });
}
exports.editarCliente = editarCliente;

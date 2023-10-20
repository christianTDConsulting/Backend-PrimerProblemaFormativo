"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editarClienteService = exports.getTelefonosService = exports.deleteClienteService = exports.createClienteService = exports.getClienteByIdService = exports.getAllClientesService = void 0;
const database_1 = __importDefault(require("../database/database"));
function getAllClientesService() {
    return database_1.default.clientes.findMany();
}
exports.getAllClientesService = getAllClientesService;
function getClienteByIdService(clienteId) {
    return database_1.default.clientes.findUnique({
        where: {
            id: clienteId,
        },
    });
}
exports.getClienteByIdService = getClienteByIdService;
function createClienteService(nuevoCliente) {
    try {
        const cliente = database_1.default.clientes.create({
            data: {
                nombre: nuevoCliente.nombre,
                email: nuevoCliente.email,
                bio: nuevoCliente.bio,
                nacimiento: nuevoCliente.nacimiento
            }
        });
        return cliente;
    }
    catch (error) {
        // Maneja el error de alguna manera
        console.error('Error al crear el cliente:', error);
        throw error; // Opcional: relanza el error para que lo maneje el código que llama a esta función
    }
}
exports.createClienteService = createClienteService;
function deleteClienteService(id) {
    try {
        return database_1.default.clientes.delete({
            where: {
                id: id,
            },
        });
    }
    catch (error) {
        console.error('Error al eliminar el Cliente:', error);
        throw error;
    }
}
exports.deleteClienteService = deleteClienteService;
function getTelefonosService(id) {
    try {
        return database_1.default.telefonos.findMany({
            where: {
                id_cliente: id,
            },
        });
    }
    catch (error) {
        console.error('Error al obtener teléfonos:', error);
        throw error;
    }
}
exports.getTelefonosService = getTelefonosService;
function editarClienteService(clienteActualizado) {
    try {
        return database_1.default.clientes.update({
            where: {
                id: clienteActualizado.id,
            },
            data: {
                nombre: clienteActualizado.nombre,
                email: clienteActualizado.email,
                bio: clienteActualizado.bio,
                nacimiento: clienteActualizado.nacimiento
            },
        });
    }
    catch (error) {
        console.error('Error al editar el Cliente:', error);
        throw error;
    }
}
exports.editarClienteService = editarClienteService;

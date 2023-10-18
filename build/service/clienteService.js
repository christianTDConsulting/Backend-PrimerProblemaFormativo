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
    return database_1.default.clientes.create({
        data: {
            nombre: nuevoCliente.nombre,
            email: nuevoCliente.email,
            bio: nuevoCliente.bio,
            nacimiento: nuevoCliente.nacimiento
        },
    });
}
exports.createClienteService = createClienteService;
function deleteClienteService(id) {
    return database_1.default.clientes.delete({
        where: {
            id: id,
        },
    });
}
exports.deleteClienteService = deleteClienteService;
function getTelefonosService(id) {
    return database_1.default.telefonos.findMany({
        where: {
            id_cliente: id,
        },
    });
}
exports.getTelefonosService = getTelefonosService;
function editarClienteService(clienteActualizado) {
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
exports.editarClienteService = editarClienteService;

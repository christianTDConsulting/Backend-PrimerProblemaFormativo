"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editTelefonosService = exports.deleteTelefonoService = exports.createTelefonoService = exports.getTelefonoByNumberIdService = exports.getAllTelefonosService = void 0;
const database_1 = __importDefault(require("../database/database"));
function getAllTelefonosService() {
    try {
        return database_1.default.telefonos.findMany();
    }
    catch (error) {
        console.error('Error al obtener teléfonos:', error);
        throw error;
    }
}
exports.getAllTelefonosService = getAllTelefonosService;
function getTelefonoByNumberIdService(id) {
    try {
        return database_1.default.telefonos.findUnique({
            where: {
                id: id,
            },
        });
    }
    catch (error) {
        console.error('Error al obtener teléfonos:', error);
        throw error;
    }
}
exports.getTelefonoByNumberIdService = getTelefonoByNumberIdService;
function createTelefonoService(number, cliente) {
    try {
        return database_1.default.telefonos.create({
            data: {
                numero: number,
                id_cliente: cliente,
            },
        });
    }
    catch (error) {
        console.error('Error al crear el teléfono:', error);
        throw error;
    }
}
exports.createTelefonoService = createTelefonoService;
function deleteTelefonoService(id) {
    try {
        return database_1.default.telefonos.delete({
            where: {
                id: id,
            },
        });
    }
    catch (error) {
        console.error('Error al eliminar el teléfono:', error);
        throw error;
    }
}
exports.deleteTelefonoService = deleteTelefonoService;
function editTelefonosService(telefono) {
    try {
        return database_1.default.telefonos.update({
            where: {
                id: telefono.id,
            },
            data: {
                numero: telefono.numero,
                id_cliente: telefono.id_cliente,
            },
        });
    }
    catch (error) {
        console.error('Error al editar el telefono:', error);
        throw error;
    }
}
exports.editTelefonosService = editTelefonosService;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTelefonoService = exports.createTelefonoService = exports.getTelefonoByNumberService = exports.getAllTelefonosService = void 0;
const database_1 = __importDefault(require("../database/database"));
function getAllTelefonosService() {
    return database_1.default.telefonos.findMany();
}
exports.getAllTelefonosService = getAllTelefonosService;
function getTelefonoByNumberService(number) {
    return database_1.default.telefonos.findUnique({
        where: {
            numero: number,
        },
    });
}
exports.getTelefonoByNumberService = getTelefonoByNumberService;
function createTelefonoService(number, cliente) {
    return database_1.default.telefonos.create({
        data: {
            numero: number,
            id_cliente: cliente,
        },
    });
}
exports.createTelefonoService = createTelefonoService;
function deleteTelefonoService(numero) {
    return database_1.default.telefonos.delete({
        where: {
            numero: numero,
        },
    });
}
exports.deleteTelefonoService = deleteTelefonoService;

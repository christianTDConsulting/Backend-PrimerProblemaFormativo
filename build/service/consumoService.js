"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConsumoPorYearService = exports.getConsumoByTelefonoService = exports.deleteConsumoService = exports.createConsumoService = exports.getConsumoByIdService = exports.getAllConsumoService = void 0;
const database_1 = require("../database/database");
function getAllConsumoService() {
    try {
        return database_1.db.consumos.findMany();
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
exports.getAllConsumoService = getAllConsumoService;
function getConsumoByIdService(id) {
    try {
        return database_1.db.consumos.findUnique({
            where: {
                id: id,
            },
        });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
exports.getConsumoByIdService = getConsumoByIdService;
function createConsumoService(nuevoConsumo) {
    try {
        return database_1.db.consumos.create({
            data: {
                id_telefono: nuevoConsumo.id_telefono,
                consumo: nuevoConsumo.consumo,
                fecha: nuevoConsumo.fecha
            }
        });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
exports.createConsumoService = createConsumoService;
function deleteConsumoService(id) {
    try {
        return database_1.db.consumos.delete({
            where: {
                id: id,
            },
        });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
exports.deleteConsumoService = deleteConsumoService;
function getConsumoByTelefonoService(id) {
    try {
        return database_1.db.consumos.findMany({
            where: {
                id_telefono: id,
            },
            orderBy: {
                fecha: 'asc', // Ordenar por fecha ascendente
            },
        });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
exports.getConsumoByTelefonoService = getConsumoByTelefonoService;
function getConsumoPorYearService(year, id_telefono) {
    try {
        const startDate = new Date(year, 0, 1).toISOString(); // Primer día del año
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999).toISOString(); // Último día del año
        return database_1.db.consumos.findMany({
            where: {
                AND: [
                    {
                        fecha: {
                            lte: endDate,
                            gte: startDate,
                        }
                    },
                    {
                        id_telefono: {
                            equals: id_telefono,
                        }
                    }
                ]
            }
        });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
exports.getConsumoPorYearService = getConsumoPorYearService;

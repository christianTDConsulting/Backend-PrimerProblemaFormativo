"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClienteDeConsumoService = exports.getMediaMaxMinConsumoService = exports.updateConsumoService = exports.getConsumoPorYearService = exports.getConsumoByTelefonoService = exports.deleteConsumoService = exports.createConsumoService = exports.getConsumoByIdService = exports.getAllConsumoService = void 0;
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
function updateConsumoService(nuevoConsumo) {
    try {
        return database_1.db.consumos.update({
            where: {
                id: nuevoConsumo.id,
            },
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
exports.updateConsumoService = updateConsumoService;
/*
SELECT
    t1.id AS id_consumo,
    t2.id AS id_telefono,
     t2.id_cliente AS id_cliente,
     t3.email AS email
FROM
   consumos t1
LEFT JOIN telefonos t2 ON t1.id_telefono = t2.id
LEFT JOIN clientes t3 ON t2.id_cliente = t3.id

*/
function getClienteDeConsumoService(id_consumo) {
    try {
        return database_1.db.$queryRaw `
        SELECT
            t1.id AS id_consumo,
            t2.id AS id_telefono,
          t2.id_cliente AS id_cliente,
          t3.email AS email
        FROM
            consumos t1
        LEFT JOIN telefonos t2 ON t1.id_telefono = t2.id
        LEFT JOIN clientes t3 ON t2.id_cliente = t3.id
        WHERE 
            t1.id = ${id_consumo}
        `;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
exports.getClienteDeConsumoService = getClienteDeConsumoService;
/*
SELECT t1.numero AS telefono, ifnull(t2.medio,0) AS media, ifnull(t2.maximo,0) AS maximo, ifnull(t2.minimo,0) AS minimo FROM telefonos t1
LEFT JOIN (SELECT id_telefono , AVG(consumo) AS medio, MAX(consumo) AS maximo, MIN(consumo) AS minimo FROM consumos GROUP BY id_telefono) t2
ON t1.id = t2.id_telefono
*/
function getMediaMaxMinConsumoService(id_telefono) {
    try {
        return database_1.db.$queryRaw `
        SELECT
            ifnull(t2.medio,0) AS media, ifnull(t2.maximo,0) AS maximo, ifnull(t2.minimo,0) AS minimo
        FROM
            telefonos t1
        LEFT JOIN
            (
                SELECT id_telefono , AVG(consumo) AS medio, MAX(consumo) AS maximo, MIN(consumo) AS minimo FROM consumos GROUP BY id_telefono
            ) t2
        ON 
            t1.id = t2.id_telefono
        WHERE
            t1.id = ${id_telefono}
   
        `;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
exports.getMediaMaxMinConsumoService = getMediaMaxMinConsumoService;

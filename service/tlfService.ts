import db from '../database/database';

function getAllTelefonosService() {
    return db.telefonos.findMany();
}
function getTelefonoByNumberService(number: string) {
    return db.telefonos.findUnique({
        where: {
            numero: number,
        },
    });
}
function createTelefonoService(number: string, cliente: number) {
    return db.telefonos.create({
        data: {
            numero: number,
            id_cliente: cliente,
        },
    });
}
function deleteTelefonoService(numero: string) {
    return db.telefonos.delete({
        where: {
            numero: numero,
        },
    });
}
export {
    getAllTelefonosService,
    getTelefonoByNumberService,
    createTelefonoService,
    deleteTelefonoService
};
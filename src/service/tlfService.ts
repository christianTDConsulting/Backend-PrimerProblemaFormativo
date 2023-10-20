import db from '../database/database';

function getAllTelefonosService() {
    try{
    return db.telefonos.findMany();
    }
    catch(error){
      console.error('Error al obtener teléfonos:', error);
      throw error;
    }
}
function getTelefonoByNumberService(number: string) {
    try{
        return db.telefonos.findUnique({
            where: {
                numero: number,
            },
        });
    } catch(error){
        console.error('Error al obtener teléfonos:', error);
        throw error;
    }
}
function createTelefonoService(number: string, cliente: number) {
    try{
        return db.telefonos.create({
            data: {
                numero: number,
                id_cliente: cliente,
            },
        });
    } catch(error){
        console.error('Error al crear el teléfono:', error);
        throw error;
    }
}
function deleteTelefonoService(numero: string) {
    try{
        return db.telefonos.delete({
            where: {
                numero: numero,
            },
        });
    }
    catch(error){
        console.error('Error al eliminar el teléfono:', error);
        throw error;
    }
   
}


export {
    getAllTelefonosService,
    getTelefonoByNumberService,
    createTelefonoService,
    deleteTelefonoService
};
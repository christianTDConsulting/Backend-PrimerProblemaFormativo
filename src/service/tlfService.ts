import { telefonos } from '@prisma/client';
import {db} from '../database/database';

function getAllTelefonosService() {
    try{
    return db.telefonos.findMany();
    }
    catch(error){
      console.error('Error al obtener teléfonos:', error);
      throw error;
    }
}
function getAllVisibleTelefonosService(visible:boolean){
    try{
        return db.telefonos.findMany({
            where: {
                visible: visible,
            },
        });
    } catch(error){
        console.error('Error al obtener teléfonos:', error);
        throw error;
    }
}
function getVisibleTelefonosFromClienteService(id: number, visible: boolean) {
    try{
        return db.telefonos.findMany({
            where: {
                id_cliente: id,
                visible: visible,
            },
        });
    } catch(error){
        console.error('Error al obtener teléfonos:', error);
        throw error;
    }
}

function getTelefonoByNumberIdService(id: number) {
    try{
        return db.telefonos.findUnique({
            where: {
                id: id,
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
function deleteTelefonoService(id: number) {
    try{
        return db.telefonos.delete({
            where: {
                id: id,
            },
        });
    }
    catch(error){
        console.error('Error al eliminar el teléfono:', error);
        throw error;
    }

}
function editTelefonosService(telefono:telefonos) {
    try{
        return db.telefonos.update({
            where: {
                id: telefono.id,
            },
            data: {
                numero: telefono.numero,
                id_cliente: telefono.id_cliente,
                visible: telefono.visible
            },
        });
    }
    catch(error){
        console.error('Error al editar el telefono:', error);
        throw error;
    }

}


export {
    getAllTelefonosService,
    getTelefonoByNumberIdService,
    createTelefonoService,
    deleteTelefonoService,
    editTelefonosService,
    getAllVisibleTelefonosService,
    getVisibleTelefonosFromClienteService
};
import {db} from '../config/database';

async function getAsistenteByNombre(nombre: string) {
    try {
        return db.asistente.findUnique({
            where: {
                nombre: nombre,
            },
        });
    } catch (error) {
        console.error('Error al obtener el asistente:', error);
        throw error;
    }
}
    
async function createAssitant(id: string, nombre: string){
    try {
        return db.asistente.create({
            data: {
                id: id,
                nombre: nombre,
            },
        });
    } catch (error) {
        console.error('Error al insertar el asistente:', error);
        throw error;
    }
}

export {getAsistenteByNombre, createAssitant}
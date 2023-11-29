import {db} from '../database/database';


export async function getAllArticulosService(){
    try {
        return await db.articulos.findMany();
    } catch (error) {
        console.error('Error al obtener los articulos:', error);
        throw error;
    }
}


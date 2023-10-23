
import { consumos } from '@prisma/client';
import {db} from '../database/database';

function getAllConsumoService(){
    try{
        return  db.consumos.findMany();
    }catch(error){
        console.log(error);
        throw error;
    }
}
function getConsumoByIdService(id:number){
    try{
        return db.consumos.findUnique({
            where: {
                id: id,
            },
        });
    }catch(error){
        console.log(error);
        throw error;
    }
}
function createConsumoService(nuevoConsumo:consumos){
    try{
        return db.consumos.create({
            data: {
                id_telefono: nuevoConsumo.id_telefono,
                consumo: nuevoConsumo.consumo,
                fecha: nuevoConsumo.fecha
            }
        });
    } catch(error){
        console.log(error);
        throw error;
    }
}
function deleteConsumoService(id:number){
    try{
        return db.consumos.delete({
            where: {
                id: id,
            },
        });
    }catch(error){
        console.log(error);
        throw error;
    }
}
function getConsumoByTelefonoService(id:number){
    return db.consumos.findMany({
        where: {
            id_telefono: id,
        },
    });
}

function getConsumoPorYearService(year:number, id_telefono:number){
    try{

        const startDate = new Date(year, 0, 1).toISOString(); // Primer día del año
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999).toISOString(); // Último día del año

        
        return db.consumos.findMany({
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
        
      
    }catch(error){
        console.log(error);
        throw error;
    }
    
}
export{
    getAllConsumoService,
    getConsumoByIdService,
    createConsumoService,
    deleteConsumoService,
    getConsumoByTelefonoService,
    getConsumoPorYearService
}
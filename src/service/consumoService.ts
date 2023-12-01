
import { consumos } from '@prisma/client';
import {db} from '../config/database';

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
    try{
        return db.consumos.findMany({
            where: {
                id_telefono: id,
            },
            orderBy: {
                fecha: 'asc', // Ordenar por fecha ascendente
            },
        });
    }catch(error){
        console.log(error);
        throw error;
    }
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
function updateConsumoService(nuevoConsumo:consumos){
    try{
        return db.consumos.update({
            where: {
                id: nuevoConsumo.id,
            },
            data: {
                id_telefono: nuevoConsumo.id_telefono,
                consumo: nuevoConsumo.consumo,
                fecha: nuevoConsumo.fecha
            }
        });
    }catch(error){
        console.log(error);
        throw error;
    }
}


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
function getClienteDeConsumoService(id_consumo:number){
    try{
        
       
        return db.$queryRaw`
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
           
            

    }catch(error){
        console.log(error);
        throw error;
    }
}


/*
SELECT t1.numero AS telefono, ifnull(t2.medio,0) AS media, ifnull(t2.maximo,0) AS maximo, ifnull(t2.minimo,0) AS minimo FROM telefonos t1
LEFT JOIN (SELECT id_telefono , AVG(consumo) AS medio, MAX(consumo) AS maximo, MIN(consumo) AS minimo FROM consumos GROUP BY id_telefono) t2
ON t1.id = t2.id_telefono
*/

function getMediaMaxMinConsumoService(id_telefono:number){
    try{
        
       
        return db.$queryRaw`
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
    getConsumoPorYearService,
    updateConsumoService,
    getMediaMaxMinConsumoService,
    getClienteDeConsumoService,
}
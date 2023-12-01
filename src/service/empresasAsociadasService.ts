import { empresas_asociadas } from '@prisma/client';
import {db} from '../config/database';

async function insertarEmpresasArray(info:empresas_asociadas[]){
    try {
        const result = await db.$transaction(async () => {
          // Insertar detalles en la tabla detalles_prediccion
          const detallesPrediccionResult = await db.empresas_asociadas.createMany({
            data: info,
            skipDuplicates: true
          });
    
          return detallesPrediccionResult;
        });
    
        return result;
      } catch (error) {
        console.error('Error al insertar empresas:', error);
        throw error;
      }
}

async function getEmpresasAsociadasService(){
    try {
      return db.empresas_asociadas.findMany();
    } catch (error) {
      console.error('Error al obtener las empresas:', error);
      throw error;
    }
}
export {insertarEmpresasArray, getEmpresasAsociadasService}
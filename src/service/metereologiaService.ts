import {db} from '../database/database';

async function insertarMunicipio(data: { id: string; nombre: string; provincia: string }) {
    try {
      return await db.municipios.create({
        data: {
          id: data.id,
          nombre: data.nombre,
          provincia: data.provincia,
        },
      });
    } catch (error) {
      console.error('Error al insertar el municipio:', error);
      throw error;
    }
  }

async function insertarDetallesService(info:any){
    try{
        return db.detalles_prediccion.create({
            data: info,
        })
    } catch(error){
        console.error('Error al insertar el detalle:', error);
        throw error;
    }
}


async function insertarDetallesArray(info:any){
    try {
        const result = await db.$transaction(async () => {
          // Insertar detalles en la tabla detalles_prediccion
          const detallesPrediccionResult = await db.detalles_prediccion.createMany({
            data: info,
          });
    
          // Realizar otras operaciones si es necesario
    
          return detallesPrediccionResult;
        });
    
        return result;
      } catch (error) {
        console.error('Error al insertar detalles:', error);
        throw error;
      }
}

async function getMunicipioByCodigoService (codigo: string) {
    try {
      return db.municipios.findUnique({
        where: {
          id: codigo,
        },
      });
    } catch (error) {
      console.error('Error al obtener el municipio:', error);
      throw error;
    }
  }


  async function obtenerDetalleExistente(data: any) {
   
    return  db.detalles_prediccion.findFirst({
      where: {
        municipio_id: data.municipio_id,
        fecha: data.fecha,
        nombre: data.nombre
      },
    });
  
  }
  
  async function actualizarDetalle(detalle: any) {
    return detalle;
    /*Por terminar */
  }

  async function getDetallesByMunicipioCode(municipioCode: string) {
    return db.detalles_prediccion.findMany({
      where: {
        municipio_id: municipioCode,
      },
    });
  }

  async function getDetallesByMunicipioCodeAndDate(municipioCode: string, fecha: Date) {
    
   
    return db.detalles_prediccion.findMany({
      where: {
        municipio_id: municipioCode,
        fecha: fecha,
      },
    });
  }
  
  async function getDetallesByCategoryNameAndMunicipioCode(categoryName: string, municipioCode: string) {
    return db.detalles_prediccion.findMany({
      where: {
        nombre: categoryName,
        municipio_id: municipioCode,
      },
    });
  }
  


  
 export { 
    insertarMunicipio,
    insertarDetallesService,
    insertarDetallesArray,
    getMunicipioByCodigoService,
    obtenerDetalleExistente,
    actualizarDetalle,
    getDetallesByMunicipioCode,
    getDetallesByMunicipioCodeAndDate,
    getDetallesByCategoryNameAndMunicipioCode
};
  
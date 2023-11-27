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
    return db.detalles_prediccion.findFirst({
      where: {
        metereologia: {
          id_municipio: data.municipio_id,
        },
        fecha: data.fecha,
        nombre: data.nombre,
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
        metereologia: {
          id_municipio: municipioCode,
        },
      },
    });
  }

  async function getDetallesByMunicipioCodeAndDate(municipioCode: string, fecha: Date) {
    return db.detalles_prediccion.findMany({
      where: {
        metereologia: {
          id_municipio: municipioCode,
        },
        fecha: fecha,
      },
    });
  }
  async function getDetallesByCategoryNameAndMunicipioCode(categoryName: string, municipioCode: string) {
    return db.detalles_prediccion.findMany({
      where: {
        nombre: categoryName,
        metereologia: {
          id_municipio: municipioCode,
        },
      },
    });
  }
  async function  getDetallesByCategoryNameAndDateMunicipioCode(categoryName: string, fecha: Date, municipioCode: string) {
    const metereologiasMasRecientes = await db.metereologia.findMany({
      where: {
        id_municipio: municipioCode,
        fecha_guardado: {
          not: null,
        },
      },
      orderBy: {
        fecha_guardado: 'desc',
      },
      take: 1,
      distinct: ['id_municipio'], // Obtener metereologías más recientes por municipio
    });
  
    const idsMetereologiasMasRecientes = metereologiasMasRecientes.map(m => m.id);
  
    const detalles = await db.detalles_prediccion.findMany({
      where: {
        nombre: categoryName,
        metereologia: {
          id: {
            in: idsMetereologiasMasRecientes,
          },
        },
        fecha: fecha,
      },
    });
  
    return detalles;
  }
  async function insertarMetereologiaService(info:any){
    try{
        return db.metereologia.create({
            data: info,
        })
    } catch(error){
        console.error('Error al insertar el detalle:', error);
        throw error;
    }
  }

  async function ObtenerMetereologiaRecienteService(idMunicipio: string){
    return db.metereologia.findMany({
      where: {
        id_municipio: idMunicipio
      },
      orderBy: {
        fecha_guardado: 'asc',
      },
      take: 1
    })
  }
  
async function getMunicipiosService (){
    try {
      return db.municipios.findMany();
    } catch (error) {
      console.error('Error al obtener el municipio:', error);
      throw error;
    }
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
    getDetallesByCategoryNameAndMunicipioCode,
    insertarMetereologiaService,
    ObtenerMetereologiaRecienteService,
    getMunicipiosService,
    getDetallesByCategoryNameAndDateMunicipioCode
};
  
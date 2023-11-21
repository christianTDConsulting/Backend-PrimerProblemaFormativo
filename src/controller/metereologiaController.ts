import { Request, Response } from 'express';
import {
  insertarMunicipio,
  insertarDetallesArray,
  getMunicipioByCodigoService,
  getDetallesByMunicipioCode,
  getDetallesByMunicipioCodeAndDate,
  getDetallesByCategoryNameAndMunicipioCode ,
  getDetallesByCategoryNameAndDateMunicipioCode,
  insertarMetereologiaService,
  ObtenerMetereologiaRecienteService,
  getMunicipiosService
} from '../service/metereologiaService';

import axios from 'axios';
import { metereologia } from '@prisma/client';
import { differenceInDays } from 'date-fns';
/**
 * Devuelve API_KEY para acceder al servidor AETER.
 * @param _req - Objeto Request de Express (no utilizado).
 * @param res - Objeto Response de Express.
 */
async function getApiKey(_req: Request, res: Response){
    res.status(200).json(process.env.API_KEY!); 
}

/**
 * Obtiene todos los municipios.
 * @param {Request} req -  Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */

async function getMunicipios (_req: Request, res: Response) {
  try {
    const municipios = await getMunicipiosService();
    res.status(200).json(municipios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching municipios' });
  }
}
/**
 * Obtiene un municipio por su código.
 * @param {Request} req -  Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */

async function getMunicpioInfo (req: Request, res: Response) {
  try {
    const municipioCode = req.params.code;
    const municipio = await getMunicipioByCodigoService(municipioCode);
    res.status(200).json(municipio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching details by municipio code' });
  }
}

/**
 * Obtener los municipios por código.
 * @param {Request} req -  Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express.
 */

async function getDetallesByMunicipioCodeController(req: Request, res: Response): Promise<void> {
  try {
    const municipioCode = req.params.code;
    const detalles = await getDetallesByMunicipioCode(municipioCode);
    console.log(detalles);
    res.status(200).json(detalles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching details by municipio code' });
  }
}

/**
 * Obtener detalles por código de municipio y fecha
 * @param {Request} req -  Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express. 
 */
async function getDetallesByMunicipioCodeAndDateController(req: Request, res: Response): Promise<void> {
  try {
    const municipioCode = req.params.code;

   //string format /ddMMyyyy
    const day = parseInt(req.params.fecha.slice(0, 2), 10);
    console.log(day);
    const month = parseInt(req.params.fecha.slice(2, 4), 10) -1; // month is 0-indexed
    console.log(month);
    const year = parseInt(req.params.fecha.slice(4,8), 10);
    console.log(year);

    // Validate the parsed date components
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      throw new Error('Invalid date components in the URL');
    }

   // console.log(day, month, year);
    const fecha = new Date(year, month, day);
    
    const formattedDate = fecha.toLocaleDateString();
    console.log(formattedDate, fecha);
    
 
    const detalles = await getDetallesByMunicipioCodeAndDate(municipioCode, fecha);
    res.status(200).json(detalles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching details by municipio code and date' });
  }
}
/**
 * Obtener los detalles por código de municipio, nombre de categoría y fecha
 * @param {Request} req -  Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express. 

 */
async function getDetallesByCategoryNameAndMunicipioCodeAndDateController(req: Request, res: Response): Promise<void>{
  try {
    const categoryName = req.params.categoryName;
    const municipioCode = req.params.code;

    //string format /ddMMyyyy
    const day = parseInt(req.params.fecha.slice(0, 2), 10);
    console.log(day);
    const month = parseInt(req.params.fecha.slice(2, 4), 10) -1; // month is 0-indexed
    console.log(month);
    const year = parseInt(req.params.fecha.slice(4,8), 10);
    console.log(year);

    const fecha = new Date(year, month, day);
    
    const formattedDate = fecha.toLocaleDateString();
    console.log(formattedDate, fecha);
    

  // Validate the parsed date components
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    throw new Error('Invalid date components in the URL');
  }
      
    const detalles = await getDetallesByCategoryNameAndDateMunicipioCode(categoryName, fecha, municipioCode);
    res.status(200).json(detalles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching details by category name and municipio code' });
  }
}


/**
 * Obtener los detalles por código de municipio y categoria
 * @param {Request} req -  Objeto Request de Express.
 * @param {Response} res - Objeto Response de Express. 

 */
async function getDetallesByCategoryNameAndMunicipioCodeController(req: Request, res: Response): Promise<void> {
  try {
    const categoryName = req.params.categoryName;
    const municipioCode = req.params.code;
    const detalles = await getDetallesByCategoryNameAndMunicipioCode(categoryName, municipioCode);
    res.status(200).json(detalles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching details by category name and municipio code' });
  }
}



/**
 * Obtiene la información de un municipio de la API de AEMET y la guarda en la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */

async function updateMunicipioInfo (req: Request, res: Response) {
    try {
      const {codigoMunicipio} = req.body;
     
      const apiKey = process.env.API_KEY!; // Reemplaza con tu API key de AEMET
      const headers = {
        'Accept': 'application/json',
        'api_key': apiKey
      };
      
     
      const apiUrl = `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${codigoMunicipio}`;
      const response = await axios.get(apiUrl, { headers });
      
     
     
      if (response.data && response.data.datos) {
        console.log(response.data);
        
        const datosUrl = response.data.datos;
    
        const datosResponse = await axios.get(datosUrl);
        console.log(datosResponse.data);
        
        
        if (datosResponse.data) {

          console.log(datosResponse.data);
          await insertarDetalles(datosResponse.data[0]);
          return res.status(200).json({ message: 'Información actualizada correctamente' });

        } else {
          return res.status(500).json({ error: 'Error al obtener la información del municipio' });
        }
        
      }
      return res.status(500).json({ error: 'Error al obtener el enlace de datos' });
    }

    catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al obtener la información del municipio' });
    }
  }





/**
 * Inserta los datos en la base de datos, creando las estructuras necesarias.
 * @param datosResponse - json que devuelve aemet con las predicciones del municipio.
 */

async function insertarDetalles(datosResponse: any) {

    const idMunicipio = datosResponse.id.toString();

    // Verificar si el municipio ya existe en la base de datos
    const municipioExistente = await getMunicipioByCodigoService(idMunicipio);

    if (municipioExistente) {
      console.log('El municipio ya existe en la base de datos.');
      
      const fechaActual = new Date();

      const metereologiaMasNueva =  await ObtenerMetereologiaRecienteService(municipioExistente.id);
      if (metereologiaMasNueva && metereologiaMasNueva.length > 0 ){ //existe meterelogia, no se debe de crear
    
        const fechaGuardado = metereologiaMasNueva[0].fecha_guardado!;
        const diferenciaDias = differenceInDays(fechaActual, fechaGuardado);

        if (diferenciaDias < 1) {
          console.log('La información ya se encuentra guardada en la base de datos.');
        }else{
          procesarYAlmacenarDetalles(datosResponse, municipioExistente);
        }
        
      }else{//no existe ninguna metereologia
        procesarYAlmacenarDetalles(datosResponse, municipioExistente);
      }
     
    } else { // El municipio no existe en la base de datos, se debe de crear
      procesarYAlmacenarDetalles(datosResponse, municipioExistente);
    }
  
}



/**
 * Procesa y almacena los detalles de la predicción meteorológica en la base de datos.
 *
 * @param datosResponse - Datos de predicción meteorológica proporcionados por AEMET.
 */
async function procesarYAlmacenarDetalles(datosResponse: any, municipioExistente: any): Promise<void> {
  try {
    if (!municipioExistente){ // si no existe el municipio, lo crea
      // Obtén el nombre y la provincia en formato UTF-8
      const nombreUtf8 = Buffer.from(datosResponse.nombre, 'latin1').toString('utf-8');
      const provinciaUtf8 = Buffer.from(datosResponse.provincia, 'latin1').toString('utf-8');

      // Elimina los caracteres irreconocibles
      const nombreLimpiado = nombreUtf8.replace(/\uFFFD/g, '-');
      const provinciaLimpiada = provinciaUtf8.replace(/\uFFFD/g, '-');

      // Crear el municipio
      const municipio = {
        id: datosResponse.id.toString(),
        nombre: nombreLimpiado,
        provincia: provinciaLimpiada,
      };
      
      // Insertar el municipio
      await insertarMunicipio(municipio);
    }
   

    // Crear registro de meteorología asociado al municipio
    const metereologia = {
      id_municipio: datosResponse.id.toString(),
      // Puedes agregar otros campos según sea necesario, como fecha guardada automáticamente con current_timestamp()
    };

    const metereologiaInsertada = await insertarMetereologiaService(metereologia);

    // Obtener detalles indexados
    const detallesArray = await getIndexedData(datosResponse, metereologiaInsertada);

    // Insertar detalles en la base de datos
    await insertarDetallesArray(detallesArray);
  } catch (error) {
    console.error('Error al procesar y almacenar detalles:', error);
    // Puedes manejar el error según tus necesidades, por ejemplo, lanzando una excepción o registrándola.
  }
}

/**
 * Devuelve los datos indexados obtenidos de Aemet
 * @param datosResponse - json que devuelve aemet con las predicciones del municipio.
 * @return municipio - Objeto con los datos del municipio.
 * @return detallesArray - Array con los detalles de la predicción.
 */

async function getIndexedData(datosResponse: any, metereologiaInsertada: metereologia) {
  
 
  const detallesArray = [];
 
  for (const predicciones of datosResponse.prediccion.dia) {
    const comun = {
      id_metereologia: metereologiaInsertada.id,
      fecha: new Date(predicciones.fecha),
    }

    //INSERTAR PRECIPITACIONES
    for ( const precipitacion of predicciones.probPrecipitacion) {
    
      const probPrecipitacion = {
        ... comun ,
        nombre:"probPrecipitacion",
        valor: precipitacion.value.toString(),
        periodo: precipitacion.periodo,
      }
     
      console.log(precipitacion.periodo);
      detallesArray.push(probPrecipitacion);
    }
      // Insertar cotaNieveProv
    for (const cotaNieve of predicciones.cotaNieveProv) {
      const cotaNieveProv = {
        ...comun,
        nombre: "cotaNieveProv",
        valor: cotaNieve.value.toString(),
        periodo: cotaNieve.periodo,
      };

      detallesArray.push(cotaNieveProv);
    }


    
    // Insertar estadoCielo
    for (const estadoCielo of predicciones.estadoCielo) {
      const estadoCieloData = {
        ...comun,
        nombre: "estadoCielo",
        valor: estadoCielo.value.toString(), //
        periodo: estadoCielo.periodo,
        descripcion: estadoCielo.descripcion,
      };

      detallesArray.push(estadoCieloData);
    }


     // Insertar viento
     for (const viento of predicciones.viento) {
      const vientoData = {
        ...comun,
        nombre: "viento",
        direccion: viento.direccion,
        velocidad: viento.velocidad, //CAMBIAR A INT EN BBDD
        periodo: viento.periodo,
      };

      detallesArray.push(vientoData);
    }


     // Insertar rachaMax
     for (const rachaMax of predicciones.rachaMax) {
      const rachaMaxData = {
        ...comun,
        nombre: "rachaMax",
        valor: rachaMax.value.toString(),
        periodo: rachaMax.periodo,
      };

      detallesArray.push(rachaMaxData);
    }

    // Insertar temperatura (Máxima)
    const temperaturaMaximaData = {
      ...comun,
      nombre: "temperatura_maxima",
      valor: predicciones.temperatura.maxima.toString(),
 
    };
    detallesArray.push(temperaturaMaximaData);


     // Insertar temperatura (Mínima)
     const temperaturaMinimaData = {
      ...comun,
      nombre: "temperatura_minima",
      valor: predicciones.temperatura.minima.toString(),
   
    };

    detallesArray.push(temperaturaMinimaData);


     // Insertar sensTermica (Máxima)
     const sensTermicaMaximaData = {
      ...comun,
      nombre: "sensTermica_maxima",
      valor: predicciones.sensTermica.maxima.toString(),
   
    };

    detallesArray.push(sensTermicaMaximaData);

    // Insertar Temperatura
    for (const temperatura of predicciones.temperatura.dato) {
      const temperaturaHora = {
        ...comun,
        nombre: "temperatura",
        valor: temperatura.value.toString(),
        hora: temperatura.hora,
      };
      detallesArray.push(temperaturaHora);
    }



   
    // Insertar sensTermica (Mínima)
    const sensTermicaMinimaData = {
      ...comun,
      nombre: "sensTermica_minima",
      valor: predicciones.sensTermica.minima.toString(),
      
    };

    detallesArray.push(sensTermicaMinimaData);
   
    // Insertar Sensasión térmica
    for (const termica of predicciones.sensTermica.dato) {
      const termicaHora = {
        ...comun,
        nombre: "temperatura",
        valor: termica.value.toString(),
        hora: termica.hora,
      };
      detallesArray.push(termicaHora);
    }


    // Insertar humedad relativa (Mínima)
    const humedadRelativaMinimaData = {
      ...comun,
      nombre: "humedad_relativa_minima",
      valor: predicciones.humedadRelativa.minima.toString(),
      
    };
    detallesArray.push(humedadRelativaMinimaData);

     // Insertar humedad relativa (Máxima)
     const humedadRelativaMaximaData = {
      ...comun,
      nombre: "humedad_relativa_maxima",
      valor: predicciones.humedadRelativa.maxima.toString(),
      
    };
    detallesArray.push(humedadRelativaMaximaData);



    // Insertar humedadRelativa
    for (const humedadRelativa of predicciones.humedadRelativa.dato) {
      const humedadRelativaData = {
        ...comun,
        nombre: "humedad_relativa",
        valor: humedadRelativa.value.toString(),
        hora: humedadRelativa.hora,
      };
      detallesArray.push(humedadRelativaData);
    }

    // Insertar uvMax
    if (predicciones.uvMax != undefined) {
        const uvMaxData = {
          ...comun,
          nombre: "uvMax",
          valor: predicciones.uvMax.toString(),
        };
    
        detallesArray.push(uvMaxData);
      }
    }

    return detallesArray;
}

export {
  getApiKey,
  updateMunicipioInfo,
  getDetallesByMunicipioCodeController,
  getDetallesByMunicipioCodeAndDateController,
  getDetallesByCategoryNameAndMunicipioCodeController,
  getDetallesByCategoryNameAndMunicipioCodeAndDateController,
  getMunicpioInfo,
  getMunicipios
}
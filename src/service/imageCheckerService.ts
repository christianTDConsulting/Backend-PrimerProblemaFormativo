
import {db} from '../config/database'
import { imagenes_carteles } from '@prisma/client';
import { ExtendedMovil, Movil } from '../interfaces/ImageCheckerInterfaces';


/**
 * Saves the image cartel service.
 *
 * @param {string} filename1 - The first filename.
 * @param {string} filaname2 - The second filename.
 * @param {string} similitud - The similitud value.
 * @return {Promise<any>} The created image cartel.
 */

async function saveImageCartelService(filename1: string, filaname2: string, probabilidad:string, comentario: string) {
  try{
  return await db.imagenes_carteles.create(
    {
      data: {       
        modelo: filename1,
        imagen: filaname2,
        resultado: probabilidad,
        comentario: comentario
      },
    }
  );
  } catch (error) {
    console.error('Error al insertar la imagen:', error);
    throw error;
  }
}



/**
 * Retrieves the images service.
 *
 * @return {Promise<imagenes_carteles[]>} A promise that resolves to an array of `imagenes_carteles` objects representing the images.
 */
async function getCartelImagesService(): Promise<imagenes_carteles[]> {
  try {
    const images: imagenes_carteles[] = await db.imagenes_carteles.findMany(
      {
        orderBy: {
          timestamp: 'desc',
        },
      }
    );

    const port = process.env.PORT || 3000;
    const backendName = process.env.BACKEND_NAME || 'localhost';

    const imagePath = `${backendName}:${port}/image`;

    // Mapeamos la matriz de imágenes para cambiar los atributos modelo e imagen por el path
    const imagesWithFiles = images.map((image) => ({
      ...image, // Copiamos todos los atributos existentes
      modelo: `${imagePath}/${image.modelo}`, // Cambiamos el atributo modelo
      imagen: `${imagePath}/${image.imagen}`, // Cambiamos el atributo imagen
    }));

    return imagesWithFiles;
  } catch (error) {
    throw error;
  }
}

async function getMovilImagesService(){
  try{
    
  } catch (error) {
    throw error;
  }
}

/**
 * Saves an image for the mobile service.
 *
 * @param {string} status - The status of the image.
 * @param {Movil[]} moviles_contados - An array of mobile objects.
 * @return {Promise<void>} - A promise that resolves when the operation is successful.
 */
async function saveImageMovilService(status: string, moviles_contados: ExtendedMovil[]) {
  try {
    // Iniciar una transacción
    await db.$transaction(async (prisma) => {
      // Crear un registro en 'imagenes_moviles' y obtener el ID generado
      const imageMovil = await prisma.imagenes_moviles.create({
        data: {   
           
          status: status,
          total: moviles_contados.length,
        },
      });

      // Preparar los datos para 'imagenes_moviles_contados'
      const contadosData = moviles_contados.map(movil => ({
        ...movil,
        id_imagenes_moviles: imageMovil.id // Usar el ID generado
      }));

      // Crear registros en 'imagenes_moviles_contados'
      await prisma.imagenes_moviles_contados.createMany({
        data: contadosData,
      });
    });

    // Operación exitosa, puedes devolver algo o simplemente finalizar
  } catch (error) {
    console.error('Error al insertar la imagen:', error);
    throw error;
  }
}


  export {
    saveImageCartelService,
    saveImageMovilService,
    getCartelImagesService,
    getMovilImagesService
  }

import {db} from '../config/database'
import { imagenes_carteles } from '@prisma/client';


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



async function getImagesService(): Promise<imagenes_carteles[]> {
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

 async function saveImageMovilService() {
  try{
  } catch (error) {
    console.error('Error al insertar la imagen:', error);
    throw error;
  }
}

  export {
    saveImageCartelService,
    saveImageMovilService,
    getImagesService,

  }
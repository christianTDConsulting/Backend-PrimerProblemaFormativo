
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
async function saveImageCartelService(filename1: string, filaname2: string, similitud:string) {
  try{
  return await db.imagenes_carteles.create(
    {
      data: {       
        modelo: filename1,
        imagen: filaname2,
        resultado: similitud
      },
    }
  );
  } catch (error) {
    console.error('Error al insertar la imagen:', error);
    throw error;
  }
}


/**
 * Retrieves images service.
 *
 * @return {Promise<{ imagen: imagenes_carteles, modelFile: string, imageFile: string }[]>} A promise that resolves to an array of objects containing image data and file paths.
 */
async function getImagesService(): Promise<{ imagen: imagenes_carteles, file1: string, file2: string }[]> {
  try {
    const images = await db.imagenes_carteles.findMany();

    const port = process.env.PORT || 3000;
    const backendName = process.env.BACKEND_NAME || 'localhost';

    const imageFolderPath = `${backendName}:${port}/image`;


   
    const imagesWithFiles = images.map((image) => {
      const file1 = `${imageFolderPath}/${image.modelo}`;
      const file2 = `${imageFolderPath}/${image.imagen}`;

      return {
        imagen: image,
        file1,
        file2,
      };
    });
    
    return imagesWithFiles;
  } catch (error) {
    throw error;
  }
  
}



  export {
    saveImageCartelService,
    getImagesService,

  }
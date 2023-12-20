import * as fs from 'fs';
import * as path from 'path';
import {db} from '../config/database'


async function saveImageService(filename: string, user_id: number) {
  try{
  return await db.imagenes.create(
    {
      data: {       
        id_usuario: user_id,
        nombre: filename,
      },
    }
  );
  } catch (error) {
    console.error('Error al insertar la imagen:', error);
    throw error;
  }
}


 async function getImagesService(): Promise<string[]> {
  const imageFolderPath =  path.join(__dirname, '..', 'assets', 'images', 'politica');

  // Lee los nombres de los archivos en la carpeta
  const files = fs.readdirSync(imageFolderPath);
  
  return files;
}

async function getImagesByUserId(user_id: number) {

  try {
    const images = await db.imagenes.findMany({ where: { id_usuario: user_id } });

    const imageFolderPath =  path.join(__dirname, '..', 'assets', 'images', 'politica');
   
    // Filtra los archivos para incluir solo aquellos cuyos nombres coinciden con los nombres de las imágenes
    const files = fs.readdirSync(imageFolderPath).filter(file => images.some(image => image.nombre === file));

    return files;
  } catch (error) {
    console.error('Error al obtener las imágenes:', error);
    throw error;
  } 
  
}

  export {
    saveImageService,
    getImagesService,
    getImagesByUserId
  }
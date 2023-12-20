import { Request, Response } from 'express';
import { getImagesService, saveImageService,getImagesByUserId} from '../service/imageCheckerService';

export async function postImage(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }
    const {user_id} = req.body;


    await saveImageService(req.file.filename, user_id);



    return res.status(200).json({ message: 'Imagen subida exitosamente' });
  } catch (error) {
    console.error('Error en la carga de la imagen:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

export async function isValidImage(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }

    //POLÍTICAS
    const existObject = await getExistentObject(req.file);

    return res.status(200).json({ isValid: existObject });
  } catch (error) {
    console.error('Error en la carga de la imagen:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}


export async function getImages(req: Request, res: Response) {
  try {
    const { id_user } = req.body;

    let images = await getImagesService();
    if (id_user) {
      images = await getImagesByUserId(id_user);
    }
    return res.status(200).json(images);
  } catch (error) {
    console.error('Error al obtener las imagenes:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

function getExistentObject(_file: Express.Multer.File) : boolean {
  return true;
}

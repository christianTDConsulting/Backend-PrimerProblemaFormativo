import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { getImagesService, saveImageCartelService} from '../service/imageCheckerService';
import { openai } from '../config/openAi';



/**
 * Handles the POST request for uploading an image.
 *
 * @param {Request} req - The request object containing the uploaded image files.
 * @param {Response} res - The response object to send back to the client.
 * @return {Promise<void>} The response containing the uploaded images or an error message.
 */


export async function postImage(req: Request, res: Response) {
  try {
    // Validator

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!files['model'] || files['model'].length === 0) {
        return res.status(400).json({ error: 'A model file is required' });
      }

      if (!files['image'] || files['image'].length === 0) {
        return res.status(400).json({ error: 'An array of images is required' });
      }



    // Access the uploaded model file
    const modelFile = files['model'][0];

    
    // Access the filenames and filepaths of the uploaded images
    const filenames = (files['image'] as Express.Multer.File[]).map(file => file.filename);
    const filepaths = (files['image'] as Express.Multer.File[]).map(file => file.path);

    // Initialize an empty array to store results
    let images: any[] = [];

    // Iterate through the uploaded image files
    for (let i = 0; i < filepaths.length; i++) {
      const openAiResult = await getOpenAiResult(modelFile.path, filepaths[i]);
      if (!openAiResult) {
        return res.status(500).json({ error: 'Internal server error (OpenAI)' });
      }
      const cleanedResponse = openAiResult.replace(/[\n\r]/g, ''); 
      // Handle OpenAI response
      if (!isValidOpenAiResponse(cleanedResponse)) {
        console.error('Error in image processing:', openAiResult);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const similarityObject = JSON.parse(openAiResult);

      // Save image data or perform other processing
      const savedImages = await saveImageCartelService(modelFile.filename, filenames[i], similarityObject.similitud);
      
      images.push(savedImages);
    }

    return res.status(200).json(images);
  } catch (error) {
    console.error('Error in image processing:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}



export async function getImages(_req: Request, res: Response) {
  try {
   
    const images = await getImagesService(); 
    return res.status(200).json(images);
  } catch (error) {
    console.error('Error al obtener las imagenes:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * Retrieves an image and sends it as a response.
 *
 * @param {Request} req - the HTTP request object
 * @param {Response} res - the HTTP response object
 * @return {Promise<void>} - a Promise that resolves when the image is sent or an error occurs
 */
export async function getImage(req: Request, res: Response) {
  try {
    const image  = req.params.image;
      
    const imagePath = path.join(__dirname, '..', '..','assets', 'images', 'carteles', image);
   
    if ( fs.existsSync(imagePath)) {
     return  res.sendFile(imagePath);
    } else {
      return res.status(404).send('Imagen no encontrada');
    }
  } catch (error) {
    console.error('Error al obtener la imagen:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}


const instrucciones = `Dame una probabilidad de que una imagen esté contenida en la otra en formato json.
Si no puedes hacerlo di que error_solicitud es true, si lo haces di que false.
Solo con este estilo: {"similitud": "muy alta/alta/media/baja/muy baja/ninguna", "error_solicitud": "true/false"}`;
async function getOpenAiResult(filePath1: string, filePath2: string) {



  const base64Image1 = await encodeImage(filePath1);
  const base64Image2 = await encodeImage(filePath2);


  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        
        content: [
          { type: "text", text: instrucciones },
          {
            type: "image_url",
            image_url: {
              "url": `data:image/jpg;base64,${base64Image1}`,
            },
          },
          {
            type: "image_url",
            image_url: {
              "url": `data:image/jpg;base64,${base64Image2}`,
            },
          },
        ],
      },
    ],
  });

  console.log(response.choices[0]);
  return response.choices[0].message.content;
}

async function encodeImage(filePath: string) {
  return fs.promises.readFile(filePath, 'base64');
}


function isValidOpenAiResponse(response: string): boolean {
  try {
    
    const similarityObject = JSON.parse(response);
    
    const hasSimilitud = similarityObject.hasOwnProperty('similitud');
    const hasErrorSolicitud = similarityObject.hasOwnProperty('error_solicitud');
    const isValidSimilitudValue = ['muy alta', 'alta', 'media', 'baja', 'muy baja', 'ninguna'].includes(similarityObject.similitud);
    const isValidErrorSolicitudValue = similarityObject.error_solicitud === 'true' || similarityObject.error_solicitud === 'false';
    const isErrorSolicitudFalse = similarityObject.error_solicitud === 'false';

    return (
      similarityObject &&
      hasSimilitud &&
      isValidSimilitudValue &&
      hasErrorSolicitud &&
      isValidErrorSolicitudValue &&
      isErrorSolicitudFalse
    );
  } catch (error) {

    console.error('Error al analizar la respuesta como JSON:', error);
    console.error(response);
    return false; // Error al analizar la respuesta como JSON
  }
}



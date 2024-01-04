import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { getImagesService, saveImageCartelService, saveImageMovilService} from '../service/imageCheckerService';
import { openai } from '../config/openAi';
import { ChatMessage, Movil } from '../interfaces/ImageChecker';

const instruccionesCarteles = `
Evalúa la probabilidad de que una imagen esté contenida dentro de otra y proporciona tu respuesta en formato JSON puro, sin incluir ningún tipo de marcado o anotaciones adicionales. Sigue las instrucciones detalladas a continuación:

1. En el campo "probabilidad", indica el nivel de certeza sobre si una imagen está contenida dentro de la otra. Utiliza uno de los siguientes términos para describir esta probabilidad: "muy alta", "alta", "media", "baja", "muy baja", "ninguna" o "error". Selecciona "error" si no es posible determinar la probabilidad.

2. Opcionalmente, puedes añadir comentarios adicionales en el campo "comentarios". Aquí puedes incluir cualquier detalle o observación que consideres relevante sobre tu evaluación de probabilidad. Este campo debe ser una cadena de texto.

Por favor, asegúrate de que tu respuesta sea un objeto JSON válido y puro, tal como se muestra en el siguiente ejemplo:
{
  "probabilidad": "alta",
  "comentarios": "Las características visuales de la imagen interna se corresponden en gran medida con las de la imagen externa."
}

Evita incluir cualquier marcado adicional como comillas adicionales, símbolos de código o anotaciones que no formen parte del formato JSON estándar.
`;



const instruccionesMoviles = `
Analiza la imagen proporcionada y determina la cantidad de teléfonos móviles presentes. Tu respuesta debe seguir el formato JSON especificado a continuación.

1. En el campo "status", indica el nivel de confianza en tu capacidad para identificar correctamente el número de móviles en la imagen. Utiliza uno de los siguientes valores para "status": "muy alta", "alta", "media", "baja", "muy baja", "ninguna" o "error". Elige "error" si no puedes determinar el nivel de confianza.

2. En el campo "moviles", proporciona un array. Cada elemento del array debe ser un objeto que represente un teléfono móvil detectado. Para cada móvil, incluye los siguientes campos:
   - "x": Indica la coordenada horizontal (eje X) del centro del móvil en píxeles dentro de la imagen.
   - "y": Indica la coordenada vertical (eje Y) del centro del móvil en píxeles dentro de la imagen.

Ejemplo de formato de respuesta:
{
  "status": "alta",
  "moviles": [
    {"x": 150, "y": 200},
    {"x": 300, "y": 400}
  ]
}

Evita incluir cualquier marcado adicional como comillas adicionales, símbolos de código o anotaciones que no formen parte del formato JSON estándar.
`;


/**
 * Handles the POST request for uploading an image.
 *
 * @param {Request} req - The request object containing the uploaded image files.
 * @param {Response} res - The response object to send back to the client.
 * @return {Promise<void>} The response containing the uploaded images or an error message.
 */


export async function postCartelImage(req: Request, res: Response) {
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

    // Crear un array de promesas para cada archivo de imagen
    const imagePromises = filepaths.map((filepath, index) => {
      //Llamada a OpenAI
      return getOpenAiResults( [modelFile.path, filepath],instruccionesCarteles)
        .then(openAiResult => {
          if (!openAiResult) {
            throw new Error('Internal server error (OpenAI)');
          }
          //Comprobar que el formato es correcto
          const cleanedResponse = openAiResult.replace(/[\n\r]/g, '');
          if (!isValidOpenAiResponse(cleanedResponse, 'carteles')) {
            console.error('Error in image processing:', openAiResult);
            throw new Error('Internal server error');
          }
          //Guardar en bbdd
          const similarityObject = JSON.parse(openAiResult);
          return saveImageCartelService(modelFile.filename, filenames[index], similarityObject.probabilidad, similarityObject.comentarios);
        });
    });

    // Esperar a que todas las promesas se resuelvan
    const images = await Promise.all(imagePromises);
    return res.status(200).json(images);

  } catch (error) {
    console.error('Error in image processing:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


export async function postImageMovil(req: Request, res: Response){
 
  //validator
 const files = req.files as { [fieldname: string]: Express.Multer.File[] };
 
  if (!files['movilImage'] || files['movilImage'].length === 0) {
    return res.status(400).json({ error: 'An array of images is required' });
  }

  const filepaths = (files['movilImage'] as Express.Multer.File[]).map(file => file.path);

  const openAiResult = await getOpenAiResults(filepaths, instruccionesMoviles);

  if (!openAiResult) {
    throw new Error('Internal server error (OpenAI)');
  }

  const cleanedResponse = openAiResult.replace(/[\n\r]/g, '');
  if (!isValidOpenAiResponse(cleanedResponse, 'moviles')) {
    console.error('Error in image processing:', openAiResult);
    throw new Error('Internal server error');
  }

  const openAIObject = JSON.parse(openAiResult);
  const images = saveImageMovilService(openAIObject.status, openAIObject.moviles);
 
  return res.status(200).json(images);

  

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
 * Retrieves an image from the server based on the provided image name.
 *
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 * @return {Promise<void>} - If the image is found, the image file is sent as a response. If the image is not found, a 404 status is sent with the message "Imagen no encontrada". If an error occurs during the retrieval, a 500 status is sent with the message "Error interno del servidor".
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









async function getOpenAiResults(filePaths: string[], instrucciones: string) {
  // Codificar todas las imágenes en base64
  const base64Images = await Promise.all(filePaths.map(filePath => encodeImage(filePath)));

  // Crear el mensaje inicial con las instrucciones como un mensaje de texto
  const initialMessage: ChatMessage[] = [{
      type: "text",
      text: instrucciones,
  }];

  // Agregar cada imagen codificada como un mensaje de imagen
  const imageMessages: ChatMessage[] = base64Images.map(base64Image => ({
      type: "image_url",
      image_url: { "url": `data:image/jpg;base64,${base64Image}` },
  }));

  // Combinar las instrucciones con las imágenes
  const messages: any = initialMessage.concat(imageMessages);

  // Hacer la solicitud a la API de OpenAI
  try {
      const response = await openai.chat.completions.create({
          model: "gpt-4-vision-preview",
          max_tokens: 500,
          temperature: 0,
          messages: [
            {
            role:"user",
            content: [...messages,],
            },
          ],
      });

      console.log(response.choices[0]);
      return response.choices[0].message.content;
  } catch (error) {
      console.error('Error al obtener resultados de OpenAI:', error);
      throw error; // O manejar el error como prefieras
  }
}

async function encodeImage(filePath: string) {
  return fs.promises.readFile(filePath, 'base64');
}


function isValidOpenAiResponse(response: string, tipoRespuesta: 'carteles' | 'moviles'): boolean {
  try {
    const responseObject = JSON.parse(response);
    
    if (tipoRespuesta === 'carteles') {
      const hasProbabilidad = responseObject.hasOwnProperty('probabilidad');
      const hasComentarios = responseObject.hasOwnProperty('comentarios');
      const isValidSimilitudValue = ['muy alta', 'alta', 'media', 'baja', 'muy baja', 'ninguna', 'error'].includes(responseObject.probabilidad);
      
      return hasProbabilidad && isValidSimilitudValue && hasComentarios;
    } else if (tipoRespuesta === 'moviles') {
      const hasStatus = responseObject.hasOwnProperty('status');
      const hasMoviles = responseObject.hasOwnProperty('moviles');
      const isValidStatusValue = ['muy alta', 'alta', 'media', 'baja', 'muy baja', 'ninguna', 'error'].includes(responseObject.status);
      
      if (hasStatus && isValidStatusValue && hasMoviles && Array.isArray(responseObject.moviles)) {
        return responseObject.moviles.every((movil: Movil) => 
        movil.hasOwnProperty('numero') && 
        movil.hasOwnProperty('x') && 
        movil.hasOwnProperty('y')
      );
      } else {
        return false;
      }
    }

    return false;
  } catch (error) {
    console.error('Error al analizar la respuesta como JSON:', error);
    console.error(response);
    return false; 
  }
}



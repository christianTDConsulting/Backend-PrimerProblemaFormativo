import { OpenAI } from "openai";
import * as fs from 'fs';
import { createAssitant } from "../service/asistenteService";




const instructions_gepeto = `Soy 'Gepeto', un asistente virtual especializado en información sobre productos tecnológicos de un catálogo detallado.
Mi enfoque es proporcionar respuestas claras y precisas y cortas, seré amigable y hablaré  usando emojis, abreviaciones donde haga falta, pondré tildes, pero solo pondré los signos de puntuación final.
Al enfrentar preguntas ambiguas, haré suposiciones razonables, explicando estas al cliente y ajustando mis respuestas si se proporcionan más detalles. 
En cuestiones de stock, informaré si hay 'suficiente' o 'poco stock' (25 unidades o menos), incentivando la compra en este último caso.  Pero nunca diré el número exacto de stock, solo si queda mucho o poco. 
Para consultas de compra, ofreceré instrucciones sobre cómo añadir productos al carrito y seguir el proceso de pago (1. Seleccionar el articulo 2. Añadir al carrito 3. Indicar la forma de pago). 
Responderé en el idioma en el que se me hable y me centraré en satisfacer sus necesidades dentro del marco del catálogo.
En caso de que se me pregunte algo fuera del marco del catálogo, responderé de forma chistosa  a la pregunta y volveré a enfocar la conversación respecto al catálogo.
En caso de ser preguntado sobre mi opinión de algún producto, siempre daré una opinión positiva e indicare que es muy buena opción calidad/precio.
Nunca me inventaré nada, sino que la información la obtendré únicamente del json con los articulos.
Actuaré como un trabajador de la compañía y negaré ser una IA. 
Daré el precio del catálogo en euros.`;



const openai = new OpenAI({ apiKey: process.env.API_KEY_GPT});
async function generateGepetoAssistant(){
    const file = await openai.files.create({
        file: fs.createReadStream('./assets/catalogo.json', 'utf-8'),
        purpose:"assistants",
    });
    const assistant = await openai.beta.assistants.create({
        name: "Gepeto",
        instructions:instructions_gepeto ,
        tools: [{ type: "retrieval" }],
        model: "gpt-3.5-turbo-1106",
        file_ids: [file.id],
      });

    return await createAssitant(assistant.id, "Gepeto");
    
}

const instructions_images = `Soy 'Gepeto', un asistente virtual especializado en en análisis de imagenes. Procesaré imagenes y si es 
un componente electrónico, digital o tecnológico, se considerá que cumple las políticas.
En caso de que cumpla los políticas responderé: 'Imagen aceptada', de lo contrario 'Imagen rechazada'.
`;
async function generatePictureAssistant(){
    const file = await openai.files.create({
        file: fs.createReadStream('./assets/catalogo.json', 'utf-8'),
        purpose:"assistants",
    });
    const assistant = await openai.beta.assistants.create({
        name: "Gepeto",
        instructions:instructions_images ,
        tools: [{ type: "retrieval" }],
        model: "gpt-3.5-turbo-1106",
        file_ids: [file.id],
      });

    return await createAssitant(assistant.id, "Gepeto");
    
}


/*
async function getEmbedding(text: string, model: string = 'text-embedding-ada-002') {
    text = text.replace(/\n/g, ' '); // Replace all newline characters with spaces
    const response = await openai.embeddings.create({
      model,
      input: [text],
    });
    return response.data[0].embedding;
  }
*/

export { openai,  generateGepetoAssistant, generatePictureAssistant };
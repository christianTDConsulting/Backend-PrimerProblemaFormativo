

import {openai, generateGepetoAssistant} from "../config/openAi";
import { Request, Response } from "express";
import { crearConversacionService,crearConversacionAnonimaService, crearMensajeService, getMessageByConversacionId } from "../service/conversacionService";
import { mensajes } from "@prisma/client";
import { getAsistenteByNombre } from "../service/asistenteService";
import emojiRegex from 'emoji-regex';

/**
 * Asks Gepeto a question and returns a response.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<void>} - a promise that resolves to void
 */




async function askGepeto(req: Request, res:Response) {
    try {
       
        const { prompt, id_conversacion } = req.body;
       

        if (!prompt) {
            return res.status(400).json({ error: 'No prompt provided' });
        }
        

        const messages = await getOpenAiResponse( id_conversacion, prompt);
     
        if (!messages) {
            return res.status(400).json({ error: 'No response from Gepeto' });
        }

        let respuesta: string =   messages.data[0].content[0].type== 'text' ? messages.data[0].content[0].text.value : "imagen";
       

        const mensaje = {
            id_conversacion: id_conversacion,
            prompt: prompt,
            respuesta: respuesta //tiene que ser string
        };

        console.log(mensaje);
        await createMensaje(mensaje);

        return res.status(200).json(respuesta);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
}
async function getOpenAiResponse( thread_id: string, prompt: string) {
   
    const message =  await openai.beta.threads.messages.create(
        thread_id,
        {
          role: "user",
          content: prompt,

        }
      );

    console.log (message);

    var gepeto = await getAsistenteByNombre("Gepeto");
    if (!gepeto) {
        gepeto = await generateGepetoAssistant();
    }
   

    const run = await openai.beta.threads.runs.create(
        thread_id,
        { 
          assistant_id: gepeto.id,
         
        }
      );

    while (true){
        const runInfo = await openai.beta.threads.runs.retrieve(thread_id, run.id);
        if (runInfo.status === 'completed'){
            break;
        }
        
    }
  
    console.log (run);

    return await openai.beta.threads.messages.list(
        thread_id,
      );
    

} 


async function createMensaje(mensaje:{
    id_conversacion: string,
    prompt: string,
    respuesta: string
})  {
    try {
        // Convert emojis to a hexadecimal representation
        const convertedMensaje = {
            ...mensaje,
            prompt: convertEmojisToHex(mensaje.prompt),
            respuesta: convertEmojisToHex(mensaje.respuesta)
        };

        return await crearMensajeService(convertedMensaje);
    } catch (error) {
        console.error(error);
        throw error; 
    }

}

function convertEmojisToHex(text: string): string {
    const regex = emojiRegex();
    return text.replace(regex, (emoji) => {
        return `\\u{${emoji.codePointAt(0)?.toString(16)}}`;
    });
}


/**
 * Creates a new conversation.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The created conversation.+
 */
async function createGepetoConversacion(req:Request, res:Response) {
    try {
        const { id_user } = req.body;
        const thread = await openai.beta.threads.create();

        var gepeto = await getAsistenteByNombre("Gepeto");
        if (!gepeto) {
            gepeto = await  generateGepetoAssistant();
        }

        if (!id_user) {
            
            const conversation = await crearConversacionAnonimaService(gepeto.id, thread.id);
            return res.status(200).json(conversation);
        }
        const conversation = await crearConversacionService(id_user, gepeto.id, thread.id);
        return res.status(200).json(conversation);
    } catch (error) {
        console.error(error);

        return  res.status(500).json({ error: 'An error occurred' });
    }
}

async function getMensajessByConversacionId(req: Request, res: Response) {
    try {
        const id_conversacion  = req.params.id;
        if (!id_conversacion) {
            return res.status(400).json({ error: 'No id provided' });
        }
        const mensajes:mensajes[] = await getMessageByConversacionId(id_conversacion);
        return res.status(200).json(mensajes);
    } catch (error) {
        console.error(error);
        throw error;
    }
}



export { askGepeto, createGepetoConversacion, getMensajessByConversacionId };
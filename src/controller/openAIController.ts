

import openai from "../config/openAi";
import { Request, Response } from "express";
import { crearConversacionService, crearMensajeService, getMessageByConversacionId } from "../service/conversacionService";


/**
 * Asks Gepeto a question and returns a response.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<void>} - a promise that resolves to void
 */

const roleSystem = {"role": "system", "content": "You are a helpful assistant."}
 async function askGepeto(req: Request, res: Response) {
    try {
        const { prompt, id_conversacion } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'No prompt provided' });
        }
        if (!id_conversacion) {
            return res.status(400).json({ error: 'No id_conversacion provided' });
        }
        
        const previousMessages = await getMessageByConversacionId(id_conversacion);
        let memory:{role: string, content: string} [] = [];
        if (!!previousMessages) {
            for (const message of previousMessages) {
                memory.push({
                    role: "user",
                    content: message.prompt
                })

                memory.push({
                    role: "assistant",
                    content: message.respuesta
                })
            }
        }
        
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages:[
                roleSystem,
                
                
                {
                role: "assistant",
                content: prompt
                },
            ],
            //stream:true,
           
            max_tokens: 50,
        } as any)
        const openaiResponse = response.choices[0].message.content; 
        
        if (!openaiResponse) {
            return res.status(400).json({ error: 'No response from Gepeto' });
        }
        const mensaje = {
            id_conversacion: id_conversacion,
            prompt: prompt,
            respuesta: openaiResponse
        }
        await createMensaje(mensaje)
        
        return res.status(200).json(openaiResponse);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
}

async function createMensaje(mensaje:{
    id_conversacion: number,
    prompt: string,
    respuesta: string
})  {
    try{
        const mensajeCreado = await crearMensajeService(mensaje);

        console.log(mensajeCreado);
        
    }catch(error){
        console.log(error);
        throw error;
    }

}


/**
 * Creates a new conversation.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The created conversation.
 */
async function createConversacion(req: Request, res: Response) {
    try {
        const id_user:number = req.body.id_usuario;
        
     
        const response = await crearConversacionService(id_user);
        return res.status(200).json(response);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
}




export { askGepeto, createConversacion };
import { conversacion } from '@prisma/client';
import {db} from '../config/database';




async function crearConversacionService(id_usuario:number, asistente:string, id:string):Promise<conversacion> {
    try {
       
        
        return await db.conversacion.create(
            {
                data: {
                    id: id,
                    id_usuario: id_usuario,
                    asistente: asistente,
                },
            }
        );


       
    } catch (error) {
        console.error("Error al crear la conversación:", error);
        throw error; // Puedes relanzar el error para que se maneje en un nivel superior si es necesario
    }
}

async function crearConversacionAnonimaService(asistente:string, id:string):Promise<conversacion> {
    try {
       
        
        return await db.conversacion.create(
            {
                data: {
                    id: id,
                    asistente: asistente,
                },
            }
        );


       
    } catch (error) {
        console.error("Error al crear la conversación:", error);
        throw error; // Puedes relanzar el error para que se maneje en un nivel superior si es necesario
    }
}

async function getMessageByConversacionId(id_conversacion: string) {
    try{
        return db.mensajes.findMany({
            where: {
                id_conversacion: id_conversacion
            },
            orderBy: {
                timestamp: 'asc'
            }
        })
    }catch(error){
        console.log(error);
        throw error
    }
}

async function crearMensajeService(mensaje: {id_conversacion: string, prompt: string, respuesta: string})  {
    try{
       await db.mensajes.create({
            data: {
                id_conversacion: mensaje.id_conversacion,
                prompt: mensaje.prompt,
                respuesta: mensaje.respuesta
            },
        })
    }catch(error){
        console.log(error);
    }
}


export { crearConversacionService, crearMensajeService, getMessageByConversacionId, crearConversacionAnonimaService }
import { conversacion } from '@prisma/client';
import {db} from '../config/database';




async function crearConversacionService(id_usuario:number):Promise<conversacion> {
    try {
        if (!id_usuario) {
            // Si id_usuario no está definido, pasamos un objeto vacío como argumento
            return await db.conversacion.create(
                {
                    data: {

                    },
                }
            );
        }

        // Si id_usuario está definido, pasamos los datos de conversacion
        return await db.conversacion.create({
            data:{
                id_usuario:id_usuario
            }
           
        });
    } catch (error) {
        console.error("Error al crear la conversación:", error);
        throw error; // Puedes relanzar el error para que se maneje en un nivel superior si es necesario
    }
}

async function getMessageByConversacionId(id_conversacion: number) {
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

async function crearMensajeService(mensaje: {id_conversacion: number, prompt: string, respuesta: string})  {
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

export { crearConversacionService, crearMensajeService, getMessageByConversacionId }
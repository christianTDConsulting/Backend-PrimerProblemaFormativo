import { logs } from '@prisma/client';
import {db} from '../database/database'




function crearUsuarioService(cryptedPassword: string, email: string) {
  
    try{
        return db.usuarios.create({
            data: {
                password: cryptedPassword,
                email: email
            }
        })
    }catch(error){
        console.error('Error al crear el usuario:', error);
        throw error;
    }
    
   
    
}


function getUserByEmailService(email: string) {
    
    try{
        return db.usuarios.findFirst({
            where: {
                email: email,
            }
        })
    }catch(error){
        console.error('Error al verificar el usuario:', error);
        throw error;
    }
    
}

function editarUsuarioService(id: number,password: string, email: string ) {
    
    try{
        return db.usuarios.update({
            where: {
                id: id
            },
            data: {
                password: password,
                email: email
            }
        })
        
    }catch(error){
        console.error('Error al editar el usuario:', error);
        throw error;
    }

}

function verUsuariosService(){
    try{
        return db.usuarios.findMany();
    }catch(error){
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
}
function verLogsService(){
    try{
        return db.logs.findMany({
            orderBy: {
                fecha: 'desc', 
            },
        });

    }catch(error){
        console.error('Error al obtener logs:', error);
        throw error;
    }
}


function postLogService(Log: logs){
    try{
        return db.logs.create({
            data: Log
        })
    }catch(error){
        console.error('Error al crear el log:', error);
        throw error;
    }
}

function getUsuarioByIdService(id: number){
    try{
        return db.usuarios.findFirst({
            where: {
                id: id
            }
        })
    }catch(error){
        console.error('Error al obtener el usuario:', error);
        throw error;
    }
}

 function findLogByEmailService(email:string) {
    return db.logs.findUnique({
        where: {
            email: email
        }
    })
  }

  function updateLogService(logId: number, intentos: number, ultimaFecha: Date) {
    return db.logs.update({
      where: { id: logId },
      data: {
        intentos: intentos,
        fecha: ultimaFecha,
      },
    });
  }

 
export {
    crearUsuarioService,
    getUserByEmailService,
    editarUsuarioService,
    verUsuariosService,
    verLogsService,
    postLogService,
    getUsuarioByIdService,
    findLogByEmailService,
    updateLogService,
    
    
}

import {db} from '../database/database'




function crearUsuarioService(cryptedPassword: string, email: string) {
  
    try{
        return db.usuarios.create({
            data: {
                password: cryptedPassword,
                email: email,
                id_perfil: 1,
            }
        })
    }catch(error){
        console.error('Error al crear el usuario:', error);
        throw error;
    }
    
   
    
}

function crearAdminService(cryptedPassword: string, email: string) {
  
    try{
        return db.usuarios.create({
            data: {
                password: cryptedPassword,
                email: email,
                id_perfil: 2,
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

 
  function getClienteFromUserService( id_usuario: number) {
    //Me devuelve todos los clientes que pueda tener asociado un usuario
    return  db.clientes.findUnique({
      where: {
        id_usuario: id_usuario,
      },
    });
  }

  function getUserByIdService(id: number){
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

function deleteUserByIdService(id: number){
    try{
        return db.usuarios.delete({
            where: {
                id: id
            }
        })
    }catch(error){
        console.error('Error al borrar el usuario:', error);
        throw error;
    }
}


export {
    crearUsuarioService,
    getUserByEmailService,
    editarUsuarioService,
    verUsuariosService,
    getUsuarioByIdService,
    crearAdminService,
    getClienteFromUserService,
    getUserByIdService,
    deleteUserByIdService,

}
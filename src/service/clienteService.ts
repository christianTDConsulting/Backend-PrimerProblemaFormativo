import { clientes } from '@prisma/client';
import {db} from '../database/database';

function getAllClientesService(){
    return  db.clientes.findMany();
}

function getAllVisibleClienteService(visible:boolean){
  try{
    return db.clientes.findMany({
      where: {
        visible: visible,
      },
    })
  }catch(error){
    console.error('Error al obtener Clientes:', error);
    throw error;
  }
}
function getClienteByIdService(clienteId:number){
    
    return db.clientes.findUnique({
        where: {
          id: clienteId,
        },
      });
}
function createClienteService(nuevoCliente:clientes){
          
  try {
    const cliente = db.clientes.create({
      data: {
        nombre: nuevoCliente.nombre,
        email: nuevoCliente.email,
        bio: nuevoCliente.bio,
        nacimiento: nuevoCliente.nacimiento,
        id_usuario: nuevoCliente.id_usuario,
        visible: true
      }
    });

    return cliente;
  } catch (error) {
    // Maneja el error de alguna manera
    console.error('Error al crear el cliente:', error);
    throw error; // Opcional: relanza el error para que lo maneje el código que llama a esta función
  }
}

function deleteClienteService(id:number){
  try{
   return  db.clientes.delete({
        where: {
          id: id,
        },
      });
    }catch(error){
      console.error('Error al eliminar el Cliente:', error);
      throw error;
    }
}
function getTelefonosService(id:number){
  try{
    return db.telefonos.findMany({
        where: {
          id_cliente: id,
        },
      });
    }catch(error){
      console.error('Error al obtener teléfonos:', error);
      throw error;
    }
}
function editarClienteService(clienteActualizado:clientes) {
  try{
    return db.clientes.update({
      where: {
        id: clienteActualizado.id,
      },
      data: {
        nombre: clienteActualizado.nombre,
        email: clienteActualizado.email,
        bio: clienteActualizado.bio,
        nacimiento: clienteActualizado.nacimiento,
        visible: true,
        id_usuario: clienteActualizado.id_usuario
      },
    });
  }catch(error){
    console.error('Error al editar el Cliente:', error);
    throw error;
}
}

/*function findLogByIpService(ip:string){
  try{

    return db.logs.findMany({
         // terminar
      });
    }catch(error){
      console.error('Error al obtener logs:', error);
      throw error;
    }
}

*/
export {
    getAllClientesService,
    getClienteByIdService,
    createClienteService,
    deleteClienteService,
    getTelefonosService,
    editarClienteService,
    getAllVisibleClienteService,
   // findLogByIpService
    
};
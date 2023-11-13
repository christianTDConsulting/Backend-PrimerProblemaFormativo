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
  try{
    return db.clientes.findUnique({
        where: {
          id: clienteId,
        },
      });
    }catch(error){
      console.error('Error al obtener cliente por id:', error);
      throw error;
    }
}
function createClienteService(nuevoCliente:clientes){
          
  try {
    const cliente = db.clientes.create({
      data: nuevoCliente
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
        bio: clienteActualizado.bio,
        nacimiento: clienteActualizado.nacimiento,
        visible: clienteActualizado.visible,
        id_usuario: clienteActualizado.id_usuario
      },
    });
  }catch(error){
    console.error('Error al editar el Cliente:', error);
    throw error;
}
}


function linkUserToClientService(id_usuario: number, id_cliente: number) {
  return db.clientes.update({
    where: {
      id: id_cliente,
    },
    data: {
      id_usuario: id_usuario,
    },
  });
}
export {
    getAllClientesService,
    getClienteByIdService,
    createClienteService,
    deleteClienteService,
    getTelefonosService,
    editarClienteService,
    getAllVisibleClienteService,
    linkUserToClientService,
    
    
};
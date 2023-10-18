import { clientes } from '@prisma/client';
import db from '../database/database';

function getAllClientesService(){
    return  db.clientes.findMany();
}
function getClienteByIdService(clienteId:number){
    
    return db.clientes.findUnique({
        where: {
          id: clienteId,
        },
      });
}
function createClienteService(nuevoCliente:clientes){
   
           
   return db.clientes.create({
        data: {
          nombre: nuevoCliente.nombre,
          email: nuevoCliente.email,
          bio: nuevoCliente.bio,
          nacimiento: nuevoCliente.nacimiento
        },
      });
}

function deleteClienteService(id:number){
   return  db.clientes.delete({
        where: {
          id: id,
        },
      });
}
function getTelefonosService(id:number){
    return db.telefonos.findMany({
        where: {
          id_cliente: id,
        },
      });
      
}
function editarClienteService(clienteActualizado:clientes) {
  return db.clientes.update({
    where: {
      id: clienteActualizado.id,
    },
    data: {
      nombre: clienteActualizado.nombre,
      email: clienteActualizado.email,
      bio: clienteActualizado.bio,
      nacimiento: clienteActualizado.nacimiento
    },
  });
  
}



export {
    getAllClientesService,
    getClienteByIdService,
    createClienteService,
    deleteClienteService,
    getTelefonosService,
    editarClienteService
};
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
function createClienteService(nombre:string){
    db.clientes.create({
        data: {
          nombre: nombre,
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
function editarClienteService(id:number, nombre:string){
    return db.clientes.update({
        where: {
          id: id,
        },
        data: {
          nombre: nombre,
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
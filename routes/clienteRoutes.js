const express = require('express');
const { getAllClientes, getClienteById, crearCliente, deleteClientes, getTlf, editarCliente} = require ('../controller/clienteController'); // Importa el servicio de cliente

const Router  = express.Router(); 

Router.get('/clientes', getAllClientes);    
 
Router.get('/clientes/:id',  getClienteById);
      
     
  

Router.post('/clientes', crearCliente);

Router.delete('/clientes/', deleteClientes);
      
     
  
Router.get('/clientes/:id/telefonos', getTlf);

Router.put('/clientes', editarCliente);

module.exports = Router; 

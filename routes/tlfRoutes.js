const express = require('express');
const { getAllTelefonos, getCliente, crearTelefono, deleteTelefono} = require ('../controller/tlfController'); // Importa el servicio de cliente

const Router  = express.Router(); 

Router.get('/telefonos', getAllTelefonos);
Router.get('/telefonos/:numero/cliente', getCliente);
Router.post('/telefonos' , crearTelefono);
Router.delete('/telefonos' , deleteTelefono);

module.exports = Router; 


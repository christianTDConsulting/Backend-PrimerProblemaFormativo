const db = require('../database/database')

async function getAllTelefonos (req, res) {

    try {
      const telefonos = await db.telefonos.findMany();
      console.log (telefonos);
      res.status(200).json(telefonos);    // Retorna todos los telefonos encontrados
    } catch (error) {
      console.error('Error al obtener telefonos');
      res.status(500).json(error);
    }
  
  }
  
  async function getCliente(req, res){


    try {
       
        const numero = req.params.numero;
        console.log(numero);
    
      const telefono = await db.telefonos.findUnique({
        where: {
          numero: numero,
        } ,
        
      });

      if (!telefono) {
        // Si no se encuentra el teléfono, puedes manejarlo aquí
        return res.status(404).json({ error: 'Teléfono no encontrado' });
      }
  

      //lista de telefonos
      const cliente = await db.clientes.findUnique({
        where: {
          id: telefono.id_cliente,
        } ,
        
      });
      
      res.status(200).json(cliente); //devuelve cliente
    } catch (error){
      console.error(error, 'Error al obtener cliente');
      res.status(500).json(error);
    }
    
  }
  // Crear un nuevo telefono
async function crearTelefono(req, res) {
    try {
      const { numero, cliente  } = req.body; // Suponiendo que el nombre se envía en el cuerpo de la solicitud
      
      const clienteExistente = await db.clientes.findUnique({
        where: {
          id: cliente,
        },
      });
  
      if (!clienteExistente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }

      const newTlf = await db.telefonos.create({
        data: {
          numero: numero,
          id_cliente: cliente
        },
      });
  
      res.status(201).json(newTlf); // Devuelve el telefono recién creado como respuesta JSON
    } catch (error) {
      console.error('Error al crear el telefono:', error);
      res.status(500).json( error);
    }
  
  }
  //Eliminar telefono por numero
  async function deleteTelefono(req, res) {
    try {
      const { numero } = req.body; // Suponiendo que el nombre se envía en el cuerpo de la solicitud
      
      // Intenta eliminar el telefono
      const deletedTLF = await db.telefonos.delete({
        where: {
          numero: numero,
        },
      });
  
      if (deletedTLF) {
        res.status(200).json({ message: 'Telefono eliminado con éxito' });
      } else {
        res.status(404).json({ error: 'Telefono no encontrado' });
      }
    } catch (error) {
      console.error('Error al eliminar el telefono:', error);
      res.status(500).json({ error: 'Error al eliminar el telefono' });
    }
  }

  module.exports = {
    getAllTelefonos,
    getCliente,
    crearTelefono,
    deleteTelefono
  };
  
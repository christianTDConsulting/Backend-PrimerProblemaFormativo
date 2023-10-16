const db = require('../database/database')
//import Cliente from '../Models/Cliente'

// Obtener todos los clientes
async function getAllClientes (req, res) {

  try {
    const clientes = await db.clientes.findMany();
    console.log (clientes)
    res.status(200).json(clientes);    // Retorna todos los clientes encontrado
  } catch (error) {
    console.error('Error al obtener clientes');
    res.status(500).json(error);
  }

 

}



// Obtener un cliente por ID
async function getClienteById(req, res) {

  
  try {
    const clienteId = parseInt(req.params.id);
    const cliente = await db.clientes.findUnique({
      where: {
        id: clienteId,
      },
    })

    if (!cliente) {
      res.status(404).json({ error: 'Cliente no encontrado' });
    }

    console.log('Cliente obtenido con éxito');
    res.status(200).json(cliente); // Envía el cliente como respuesta JSON
  } catch (error) {
    console.error('Error al obtenercliente ', error);
    res.status(500).json(error);
  }
}


// Crear un nuevo cliente
async function crearCliente(req, res) {
  try {
    const { nombre } = req.body; // Suponiendo que el nombre se envía en el cuerpo de la solicitud

    const newClient = await db.clientes.create({
      data: {
        nombre: nombre,
      },
    });

    res.status(201).json(newClient); // Devuelve el cliente recién creado como respuesta JSON
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    res.status(500).json( error);
  }

}
//Eliminar cliente por ID
async function deleteClientes(req, res) {
  try {
    const { id } = req.body; // Suponiendo que el nombre se envía en el cuerpo de la solicitud
    //const clienteId = parseInt(req.params.id);
    // Intenta eliminar el cliente
    const deletedClient = await db.clientes.delete({
      where: {
        id: id,
      },
    });

    if (deletedClient) {
      res.status(200).json({ message: 'Cliente eliminado con éxito' });
    } else {
      res.status(404).json({ error: 'Cliente no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
}

//Obtener lista de telefonos de un ID
async function getTlf(req, res){

  try {
    const clienteId = parseInt(req.params.id);
    console.log(clienteId)
    //lista de telefonos
    const tlf = await db.telefonos.findMany({
      where: {
        id_cliente: clienteId,
      } ,
      
    });
    
    res.status(200).json(tlf); //lista de telefonos
  } catch (error){
    console.error(error, 'Error al obtener telefonos');
    res.status(500).json(error);
  }
  
}
async function editarCliente(req, res) {
  try {
    const { id, nombre } = req.body; // Suponiendo que el ID y el nuevo número se envían en el cuerpo de la solicitud

    // Verifica si el cliente existe
    const clienteExistente = await db.clientes.findUnique({
      where: {
        id: id,
      },
    });

    if (!clienteExistente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Actualiza el cliente
    const updatedCliente = await db.clientes.update({
      where: {
        id: id,
      },
      data: {
        nombre: nombre,
      },
    });

    res.status(200).json(updatedCliente); // Devuelve el cliente actualizado como respuesta JSON
  } catch (error) {
    console.error('Error al editar el cliente:', error);
    res.status(500).json({ error: 'Error al editar el cliente' });
  }
}




module.exports = {
  getAllClientes,
  getClienteById,
  crearCliente,
  deleteClientes,
  getTlf,
  editarCliente
};

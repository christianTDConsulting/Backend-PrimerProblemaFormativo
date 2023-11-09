import { Request, Response } from 'express';
import { getAllClientesService, getClienteByIdService, createClienteService, deleteClienteService, getTelefonosService, editarClienteService, getAllVisibleClienteService } from '../service/clienteService';
import {getUserByIdService } from '../service/usuarioService';
// Obtener todos los clientes
async function getAllClientes(_req: Request, res: Response) {
  try {
    const clientes = await getAllClientesService();
    console.log(clientes);

    const formattedClientes = await Promise.all(
      clientes.map(async (cliente) => {
        const usuario = await getUserByIdService(cliente.id_usuario);
        return {
          id: cliente.id,
          usuario: usuario,
          nombre: cliente.nombre,
          bio: cliente.bio,
          nacimiento: cliente.nacimiento,
          visible: cliente.visible,
        };
      })
    );

    res.status(200).json(formattedClientes); // Retorna todos los clientes encontrados
  } catch (error) {
    console.error('Error al obtener clientes');
    res.status(500).json(error);
  }
}

// Obtener un cliente por ID
async function getClienteById(req: Request, res: Response) {
  try {
    const clienteId = parseInt(req.params.id);
    const cliente = await getClienteByIdService(clienteId);
    if (!cliente) {
      res.status(404).json({ error: 'Cliente no encontrado' }); 
      
    } else{

      console.log('Cliente obtenido con éxito');
      const usuario = await getUserByIdService(cliente.id_usuario);
      const formattedCliente = {
        id: cliente.id,
        usuario: usuario,
        nombre: cliente.nombre,
        bio: cliente.bio,
        nacimiento: cliente.nacimiento,
        visible: cliente.visible,
      };
      res.status(200).json(formattedCliente); // Envía el cliente como respuesta JSON
    }

  } catch (error) {
    console.error('Error al obtener cliente ', error);
    res.status(500).json(error);
  }
}

// Crear un nuevo cliente
async function crearCliente(req: Request, res: Response) {
  try {
    
    const nuevoCliente = req.body; // Suponiendo que el nombre se envía en el cuerpo de la solicitud

    if (!nuevoCliente || !nuevoCliente.nombre || !nuevoCliente.email) {
       res.status(400).json({ error: 'Campos requeridos faltantes' }); //lanzar return?
       console.log('Cliente creado')
    }else{
      const newClient = await createClienteService(nuevoCliente);
      res.status(200).json(newClient); // Devuelve el cliente recién creado como respuesta JSON
    }


  } catch (error) {
    console.error('Error al crear el cliente:', error);
    res.status(500).json(error);
  }
}

// Eliminar cliente por ID
async function deleteClientes(req: Request, res: Response) {
  try {
    const { id } = req.body; // Suponiendo que el ID se envía en el cuerpo de la solicitud
    console.log(id);
    // Intenta eliminar el cliente
    const deletedClient = await deleteClienteService(id);

    if (deletedClient) {
      res.status(200).json({ message: 'Cliente eliminado con éxito' });
      console.log("cliente eliminado");
    } else {
      res.status(404).json({ error: 'Cliente no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
}

// Obtener lista de teléfonos de un ID
async function getTlf(req: Request, res: Response) {
  try {
    const clienteId = parseInt(req.params.id);
    
    // Lista de teléfonos
    const tlf = await getTelefonosService(clienteId);

    res.status(200).json(tlf); // Lista de teléfonos
    console.log("telefono obtenido: " + tlf);
  } catch (error) {
    console.error(error, 'Error al obtener teléfonos');
    res.status(500).json(error);
  }
}

async function editarCliente(req: Request, res: Response) {
  try {
    const clienteActualizado = req.body; // Suponiendo que el ID y el nuevo número se envían en el cuerpo de la solicitud

    // Verifica si el cliente existe
    const clienteExistente = await getClienteByIdService(clienteActualizado.id)

    if (!clienteExistente) {
       res.status(404).json({ error: 'Cliente no encontrado' });
    }else{

    // Actualiza el cliente
    const updatedCliente = await editarClienteService(clienteActualizado);

    res.status(200).json(updatedCliente); // Devuelve el cliente actualizado como respuesta JSON
    console.log("cliente editado")
    }
  } catch (error) {
    console.error('Error al editar el cliente:', error);
     res.status(500).json({ error: 'Error al editar el cliente' });
  }
}

async function toggleVisibility(req: Request, res: Response){
  try{
    const id = parseInt(req.params.id);
    const clienteExistente = await getClienteByIdService(id);
    if (!clienteExistente){
      res.status(404).json({ error: 'Cliente  no encontrado' });
    }else{
      clienteExistente.visible = !clienteExistente.visible;
      const updatedCliente = await editarClienteService(clienteExistente);
      res.status(200).json(updatedCliente);
      console.log("telefono Editado");
    }

  } catch(error) {
    console.error('Error al cambiar visibilidad  del cliente:', error);
    res.status(500).json({ error: 'Error al cambiar visibilidad  del cliente' });
  }

}
async function getAllClientesVisible(req: Request, res: Response) {
  try {
    const visibleParam  = req.params.visible;
    const visible = visibleParam === 'true';

    const clientes = await getAllVisibleClienteService(visible);

    const formattedClientes = await Promise.all(
      clientes.map(async (cliente) => {
        const usuario = await getUserByIdService(cliente.id_usuario);
        return {
          id: cliente.id,
          usuario: usuario,
          nombre: cliente.nombre,
          bio: cliente.bio,
          nacimiento: cliente.nacimiento,
          visible: cliente.visible,
        };
      })
    );

    console.log(formattedClientes);
    res.status(200).json(formattedClientes);
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    res.status(500).json({ error: 'Error al obtener los clientes' });
  }
}


export {
  getAllClientes,
  getClienteById,
  crearCliente,
  deleteClientes,
  getTlf,
  editarCliente,
  toggleVisibility,
  getAllClientesVisible,

  
};

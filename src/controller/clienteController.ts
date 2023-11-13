import { Request, Response } from 'express';
import {
  getAllClientesService,
  getClienteByIdService,
  createClienteService,
  deleteClienteService,
  getTelefonosService,
  editarClienteService,
  getAllVisibleClienteService,
} from '../service/clienteService';
import { getUserByIdService } from '../service/usuarioService';

/**
 * Obtiene todos los clientes con información adicional del usuario asociado.
 * @param _req - Objeto Request de Express (no utilizado).
 * @param res - Objeto Response de Express.
 */
async function getAllClientes(_req: Request, res: Response) {
  try {
    const clientes = await getAllClientesService();

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

/**
 * Obtiene un cliente por su ID con información adicional del usuario asociado.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function getClienteById(req: Request, res: Response) {
  try {
    const clienteId = parseInt(req.params.id);
    const cliente = await getClienteByIdService(clienteId);

    if (!cliente) {
      res.status(404).json({ error: 'Cliente no encontrado' });
    } else {
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

/**
 * Crea un nuevo cliente en la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function crearCliente(req: Request, res: Response) {
  try {
    const nuevoCliente = req.body;

    if (!nuevoCliente || !nuevoCliente.nombre || !nuevoCliente.email) {
      res.status(400).json({ error: 'Campos requeridos faltantes' });
    } else {
      const newClient = await createClienteService(nuevoCliente);
      res.status(200).json(newClient); // Devuelve el cliente recién creado como respuesta JSON
    }
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    res.status(500).json(error);
  }
}

/**
 * Elimina un cliente por su ID de la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function deleteClientes(req: Request, res: Response) {
  try {
    const { id } = req.body;
    console.log(id);

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

/**
 * Obtiene la lista de teléfonos asociados a un ID de cliente.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function getTlf(req: Request, res: Response) {
  try {
    const clienteId = parseInt(req.params.id);

    const tlf = await getTelefonosService(clienteId);

    res.status(200).json(tlf); // Lista de teléfonos
    console.log("telefono obtenido: " + tlf);
  } catch (error) {
    console.error(error, 'Error al obtener teléfonos');
    res.status(500).json(error);
  }
}

/**
 * Edita un cliente en la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function editarCliente(req: Request, res: Response) {
  try {
    const clienteActualizado = req.body;

    const clienteExistente = await getClienteByIdService(clienteActualizado.id);

    if (!clienteExistente) {
      res.status(404).json({ error: 'Cliente no encontrado' });
    } else {
      const updatedCliente = await editarClienteService(clienteActualizado);
      res.status(200).json(updatedCliente); // Devuelve el cliente actualizado como respuesta JSON
      console.log("cliente editado")
    }
  } catch (error) {
    console.error('Error al editar el cliente:', error);
    res.status(500).json({ error: 'Error al editar el cliente' });
  }
}

/**
 * Cambia la visibilidad de un cliente en la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function toggleVisibility(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const clienteExistente = await getClienteByIdService(id);
    if (!clienteExistente) {
      res.status(404).json({ error: 'Cliente  no encontrado' });
    } else {
      clienteExistente.visible = !clienteExistente.visible;
      const updatedCliente = await editarClienteService(clienteExistente);
      res.status(200).json(updatedCliente);
      console.log("telefono Editado");
    }
  } catch (error) {
    console.error('Error al cambiar visibilidad  del cliente:', error);
    res.status(500).json({ error: 'Error al cambiar visibilidad  del cliente' });
  }
}

/**
 * Obtiene todos los clientes visibles o no visibles en la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function getAllClientesVisible(req: Request, res: Response) {
  try {
    const visibleParam = req.params.visible;
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

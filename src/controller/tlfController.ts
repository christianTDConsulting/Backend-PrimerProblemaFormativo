import { Request, Response } from 'express';
import {
  getAllTelefonosService,
  getTelefonoByNumberIdService,
  createTelefonoService,
  deleteTelefonoService,
  editTelefonosService,
  getAllVisibleTelefonosService,
  getVisibleTelefonosFromClienteService,
} from '../service/tlfService';
import { getClienteByIdService } from '../service/clienteService';

/**
 * Obtiene todos los teléfonos de la base de datos.
 * @param _req - Objeto Request de Express (no utilizado).
 * @param res - Objeto Response de Express.
 */
async function getAllTelefonos(_req: Request, res: Response) {
  try {
    const telefonos = await getAllTelefonosService();
    console.log(telefonos);
    res.status(200).json(telefonos); // Retorna todos los teléfonos encontrados
  } catch (error) {
    console.error('Error al obtener teléfonos');
    res.status(500).json(error);
  }
}

/**
 * Obtiene el cliente asociado a un teléfono por su ID.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function getCliente(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const telefono = await getTelefonoByNumberIdService(parseInt(id));

    if (!telefono) {
      res.status(404).json({ error: 'Teléfono no encontrado' });
    } else {
      const cliente = await getClienteByIdService(telefono.id_cliente);
      res.status(200).json(cliente); // Devuelve el cliente asociado al teléfono
      console.log(cliente);
    }
  } catch (error) {
    console.error('Error al obtener cliente', error);
    res.status(500).json(error);
  }
}

/**
 * Crea un nuevo teléfono en la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function crearTelefono(req: Request, res: Response) {
  try {
    const { numero, cliente } = req.body;
    const clienteExistente = await getClienteByIdService(cliente);

    if (!clienteExistente) {
      res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const newTlf = await createTelefonoService(numero, cliente);
    res.status(201).json(newTlf); // Devuelve el teléfono recién creado como respuesta JSON
    console.log('Teléfono creado');
  } catch (error) {
    console.error('Error al crear el teléfono:', error);
    res.status(500).json(error);
  }
}

/**
 * Elimina un teléfono de la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function deleteTelefono(req: Request, res: Response) {
  try {
    const { id } = req.body;
    const deletedTLF = await deleteTelefonoService(id);

    if (deletedTLF) {
      res.status(200).json({ message: 'Teléfono eliminado con éxito' });
      console.log('Teléfono eliminado');
    } else {
      res.status(404).json({ error: 'Teléfono no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el teléfono:', error);
    res.status(500).json({ error: 'Error al eliminar el teléfono' });
  }
}

/**
 * Edita un teléfono en la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function editTelefonos(req: Request, res: Response) {
  try {
    const tlfActualizado = req.body;
    const telefonoExistente = await getTelefonoByNumberIdService(tlfActualizado.id);

    if (!telefonoExistente) {
      res.status(404).json({ error: 'Teléfono no encontrado' });
    } else {
      const updatedTlf = await editTelefonosService(tlfActualizado);
      res.status(200).json(updatedTlf);
      console.log('Teléfono editado');
    }
  } catch (error) {
    console.error('Error al editar el teléfono:', error);
    res.status(500).json({ error: 'Error al editar el teléfono' });
  }
}

/**
 * Cambia la visibilidad de un teléfono en la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function toggleVisibility(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const telefonoExistente = await getTelefonoByNumberIdService(id);

    if (!telefonoExistente) {
      res.status(404).json({ error: 'Teléfono no encontrado' });
    } else {
      telefonoExistente.visible = !telefonoExistente.visible;
      const updatedTlf = await editTelefonosService(telefonoExistente);
      res.status(200).json(updatedTlf);
      console.log('Teléfono editado');
    }
  } catch (error) {
    console.error('Error al cambiar visibilidad del teléfono:', error);
    res.status(500).json({ error: 'Error al cambiar visibilidad del teléfono' });
  }
}

/**
 * Obtiene todos los teléfonos visibles o no visibles de la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function getAllVisibleTelefonos(req: Request, res: Response) {
  try {
    const visibleParam = req.params.visible;
    const visible = visibleParam === 'true';

    const telefonos = await getAllVisibleTelefonosService(visible);
    console.log(telefonos);
    res.status(200).json(telefonos); // Retorna todos los teléfonos encontrados
  } catch (error) {
    console.error('Error al obtener teléfonos');
    res.status(500).json(error);
  }
}

/**
 * Obtiene todos los teléfonos visibles o no visibles asociados a un cliente específico.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function getVisibleTelefonosFromCliente(req: Request, res: Response) {
  try {
    const clienteId = parseInt(req.params.id);
    const visibleParam = req.params.visible;
    const visible = visibleParam === 'true';

    const telefonos = await getVisibleTelefonosFromClienteService(clienteId, visible);
    console.log(telefonos);
    res.status(200).json(telefonos); // Retorna todos los teléfonos encontrados
  } catch (error) {
    console.error('Error al obtener teléfonos');
    res.status(500).json(error);
  }
}

export {
  getAllTelefonos,
  getCliente,
  crearTelefono,
  deleteTelefono,
  editTelefonos,
  toggleVisibility,
  getAllVisibleTelefonos,
  getVisibleTelefonosFromCliente,
};

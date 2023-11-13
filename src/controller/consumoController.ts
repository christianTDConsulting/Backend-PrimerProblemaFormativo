import { Request, Response } from 'express';
import {
  getAllConsumoService,
  getConsumoByIdService,
  createConsumoService,
  deleteConsumoService,
  getConsumoByTelefonoService,
  getConsumoPorYearService,
  updateConsumoService,
  getMediaMaxMinConsumoService,
  getClienteDeConsumoService,
} from '../service/consumoService';

import { getTelefonosService } from '../service/clienteService';

/**
 * Obtiene todos los registros de consumo de la base de datos.
 * @param _req - Objeto Request de Express (no utilizado).
 * @param res - Objeto Response de Express.
 */
async function getAllConsumo(_req: Request, res: Response) {
  try {
    const consumos = await getAllConsumoService();
    res.status(200).json(consumos); // Retorna todos los consumos encontrados
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

/**
 * Obtiene un registro de consumo por su ID.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function getConsumoById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const consumo = await getConsumoByIdService(id);

    if (!consumo) {
      res.status(404).json({ error: 'Consumo no encontrado' });
    } else {
      res.status(200).json(consumo);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

/**
 * Crea un nuevo registro de consumo en la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function crearConsumo(req: Request, res: Response) {
  try {
    const nuevoConsumo = req.body;

    if (!nuevoConsumo) {
      res.status(400).json({ error: 'Campos requeridos faltantes' });
    } else {
      const newConsumo = await createConsumoService(nuevoConsumo);
      res.status(200).json(newConsumo);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

/**
 * Elimina un registro de consumo de la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function deleteConsumo(req: Request, res: Response) {
  try {
    const { id } = req.body;

    if (!id) {
      res.status(400).json({ error: 'Campos requeridos faltantes' });
    } else {
      const deleteConsumo = await deleteConsumoService(id);
      res.status(200).json(deleteConsumo);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

/**
 * Obtiene los registros de consumo asociados a un teléfono específico.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function getConsumoTelefonos(req: Request, res: Response) {
  try {
    const id_telefono = parseInt(req.params.telefono);

    if (!id_telefono) {
      res.status(400).json({ error: 'Campos requeridos faltantes' });
    } else {
      const consumos = await getConsumoByTelefonoService(id_telefono);
      res.status(200).json(consumos);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

/**
 * Obtiene los registros de consumo asociados a todos los teléfonos de un cliente.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function getConsumoClientes(req: Request, res: Response) {
  try {
    const id_cliente = parseInt(req.params.cliente);

    if (!id_cliente) {
      res.status(400).json({ error: 'Campos requeridos faltantes' });
    } else {
      const telefonosCliente = await getTelefonosService(id_cliente);
      let consumos = [];
      for (const telefono of telefonosCliente) {
        const consumo = await getConsumoByTelefonoService(telefono.id);
        consumos.push(consumo);
      }
      res.status(200).json(consumos);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

/**
 * Obtiene el consumo anual para un teléfono específico en un año determinado.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function getConsumoAnual(req: Request, res: Response) {
  try {
    const { year, id_telefono } = req.body;

    if (!year || !id_telefono) {
      res.status(400).json({ error: 'La fecha es un campo requerido' });
    } else {
      const consumo = await getConsumoPorYearService(year, id_telefono);
      res.status(200).json(consumo);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * Actualiza un registro de consumo en la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function updateConsumo(req: Request, res: Response) {
  try {
    const consumoActualizado = req.body;
    const consumoExistente = await getConsumoByIdService(consumoActualizado.id);

    if (!consumoExistente) {
      res.status(404).json({ error: 'Consumo no encontrado' });
    } else {
      const updatedConsumo = await updateConsumoService(consumoActualizado);
      res.status(200).json(updatedConsumo);
    }
  } catch (error) {
    console.error('Error al editar el consumo:', error);
    res.status(500).json({ error: 'Error al editar el consumo' });
  }
}

/**
 * Obtiene la media, máximo y mínimo de los registros de consumo asociados a un teléfono.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function getMediaMaxMinConsumo(req: Request, res: Response) {
  try {
    const id_telefono = parseInt(req.params.telefono);
    const mediaMaxMinConsumo = await getMediaMaxMinConsumoService(id_telefono);
    res.status(200).json(mediaMaxMinConsumo);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

/**
 * Obtiene el cliente asociado a un registro de consumo.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function getCliente(req: Request, res: Response) {
  try {
    const id_consumo = parseInt(req.params.consumo);
    const datos = await getClienteDeConsumoService(id_consumo);
    res.status(200).json(datos);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

export {
  getAllConsumo,
  getConsumoById,
  crearConsumo,
  deleteConsumo,
  getConsumoClientes,
  getConsumoTelefonos,
  getConsumoAnual,
  updateConsumo,
  getMediaMaxMinConsumo,
  getCliente,
};

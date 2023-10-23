import { Request, Response } from 'express';
import { getAllTelefonosService, getTelefonoByNumberIdService, createTelefonoService, deleteTelefonoService, editTelefonosService} from '../service/tlfService';
import { getClienteByIdService } from '../service/clienteService';
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

async function getCliente(req: Request, res: Response) {
  try {
    const id = req.params.id;
    console.log(id);

    const telefono = await getTelefonoByNumberIdService(parseInt(id));

    if (!telefono) {
       res.status(404).json({ error: 'Teléfono no encontrado' });
    }else{
      const cliente = await getClienteByIdService(telefono.id_cliente);
  
       res.status(200).json(cliente); // Devuelve el cliente
    }

    
  } catch (error) {
    console.error('Error al obtener cliente', error);
     res.status(500).json(error);
  }
}

async function crearTelefono(req: Request, res: Response) {
  try {
    const { numero, cliente } = req.body; // Suponiendo que el número y el cliente se envían en el cuerpo de la solicitud

    const clienteExistente = await getClienteByIdService(cliente);

    if (!clienteExistente) {
       res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const newTlf = await createTelefonoService(numero, cliente);

     res.status(201).json(newTlf); // Devuelve el teléfono recién creado como respuesta JSON
  } catch (error) {
    console.error('Error al crear el teléfono:', error);
      res.status(500).json(error);
  }
}

async function deleteTelefono(req: Request, res: Response) {
  try {
    const { id } = req.body; // Suponiendo que el número se envía en el cuerpo de la solicitud

    const deletedTLF = await deleteTelefonoService(id);

    if (deletedTLF) {
       res.status(200).json({ message: 'Teléfono eliminado con éxito' });
    } else {
       res.status(404).json({ error: 'Teléfono no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar el teléfono:', error);
     res.status(500).json({ error: 'Error al eliminar el teléfono' });
  }
}
async function editTelefonos(req: Request, res: Response) {
  try {
    const tlfActualizado = req.body; // Suponiendo que el número se envío en el cuerpo de la solicitud
    //Verifica si el telefono existe
    const telefonoExistente = await getTelefonoByNumberIdService(tlfActualizado.id);
    if (!telefonoExistente){
      res.status(404).json({ error: 'Telefono no encontrado' });
    }else{
    //Actualiza el telefono 
    const updatedCliente = await editTelefonosService(tlfActualizado);
    res.status(200).json(updatedCliente);
    }
  } catch (error) {
    console.error('Error al editar el telefono:', error);
     res.status(500).json({ error: 'Error al editar el telefono' });
  }
  
}
export { getAllTelefonos, getCliente, crearTelefono, deleteTelefono, editTelefonos };

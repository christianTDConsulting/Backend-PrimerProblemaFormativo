import { Request, Response } from 'express';
import {getAllConsumoService, 
        getConsumoByIdService, 
        createConsumoService, 
        deleteConsumoService, 
        getConsumoByTelefonoService,
        getConsumoPorYearService} from '../service/consumoService';
import { getTelefonosService } from '../service/clienteService';
async function getAllConsumo(_req:Request, res: Response){
    try{
        const consumos = await getAllConsumoService();
        res.status(200).json(consumos); // Retorna todos los consumos encontrados
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

async function getConsumoById(req:Request, res: Response){
    try{
        const id = parseInt(req.params.id);
        const consumo = await getConsumoByIdService(id);

        if(!consumo){
            res.status(404).json({error: 'Consumo no encontrado'});
        }else{
            res.status(200).json(consumo);
        }
    } catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}
async function crearConsumo(req:Request, res: Response){
    try{
        const nuevoConsumo = req.body;
        if (!nuevoConsumo){
            res.status(400).json({error: 'Campos requeridos faltantes'});
        }else{
            const newConsumo = await createConsumoService(nuevoConsumo);
            res.status(200).json(newConsumo);
        }
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}
async function deleteConsumo(req:Request, res: Response){
    try{
        const {id} = req.body;
        if (!id){
            res.status(400).json({error: 'Campos requeridos faltantes'});
        }else{
            const deleteConsumo = await deleteConsumoService(id);
            res.status(200).json(deleteConsumo);
        }
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }

}
async function getConsumoTelefonos(req:Request, res: Response){
    try{
        const id_telefono = parseInt(req.params.telefono);
       
      if (!id_telefono) {
        res.status(400).json({ error: 'Campos requeridos faltantes' });
      } else {
        const consumos = await getConsumoByTelefonoService(id_telefono);
        res.status(200).json(consumos);
      }
        
        
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }

}

async function getConsumoClientes(req:Request, res: Response){
    try{
        const id_cliente = parseInt(req.params.cliente);
        if (!id_cliente){
            res.status(400).json({error: 'Campos requeridos faltantes'});
        }else{
            const telefonosCliente = await getTelefonosService(id_cliente); //obtengo los telefonos
            //por carada telefono obtengo los consumos
            let consumos = [];
            for (const telefono of telefonosCliente) {
                const consumo = await getConsumoByTelefonoService(telefono.id);
                consumos.push(consumo); // Usar push para agregar elementos a un array
            }
            res.status(200).json(consumos);
        }
    } catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

async function getConsumoAnual(req: Request, res: Response) {
    try {
        const {year, id_telefono} = req.body; 
        console.log("OJO" + year +  id_telefono);

        if (!year || !id_telefono ) {
            res.status(400).json({ error: 'La fecha es un campo requerido' });
        } else {
            // Lógica para obtener el consumo para la fecha especificada.
            const consumo = await getConsumoPorYearService(year, id_telefono);
           // const consumo = await getAllConsumoService();
             res.status(200).json( consumo );
            
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



export{
    getAllConsumo,
    getConsumoById,
    crearConsumo,
    deleteConsumo,
    getConsumoClientes,
    getConsumoTelefonos,
    getConsumoAnual
    

}
import { Request, Response } from 'express';
import { insertarEmpresasArray, getEmpresasAsociadasService } from '../service/empresasAsociadasService';
import { empresas_asociadas } from '@prisma/client';
async function insertarEmpresas(req: Request, res: Response) {
    try {
        const empresas: empresas_asociadas[]= req.body;
        const result = await insertarEmpresasArray(empresas);
        res.status(200).json({ message: 'Exito', result: result });
        console.log('Empresa creada');
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
async function getEmpresas(_req: Request, res: Response) {
  try{
    const result = await getEmpresasAsociadasService();
    res.status(201).json(result);
    console.log('Empresa obtenida');
  }catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}
  export { insertarEmpresas, getEmpresas }
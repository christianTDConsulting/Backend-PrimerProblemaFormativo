import { Request, Response } from 'express';

import { getAllArticulosService } from '../service/articuloService';

export const getAllArticulos = async (_req: Request, res: Response) => {
    try{
        const articulos = await getAllArticulosService();
        res.status(200).json(articulos);
    } catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}
import {Request, Response} from 'express';

import { verLogsService, getBloqueosService } from '../service/logService';

async function verLogs(_req: Request, res: Response) {
    try {
        const logs = await verLogsService();
        res.status(200).json(logs);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
async function getBloqueos(_req: Request, res: Response) {
    try {
        const logs = await getBloqueosService();
        res.status(200).json(logs);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export {verLogs, getBloqueos}
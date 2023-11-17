import express, { Router } from 'express';
import { getApiKey, updateMunicipioInfo, getDetallesByMunicipioCodeController, getDetallesByMunicipioCodeAndDateController, getDetallesByCategoryNameAndMunicipioCodeController} from '../controller/metereologiaController';

const MetereoRouter:Router = express.Router();

MetereoRouter.get('/apiKey',getApiKey);
MetereoRouter.get('/addInfo/:codigo',updateMunicipioInfo);
MetereoRouter.get('/detalles/:code', getDetallesByMunicipioCodeController);
MetereoRouter.get('/detalles/:code/:fecha', getDetallesByMunicipioCodeAndDateController);
MetereoRouter.get('/detalles/:code/name/:categoryName', getDetallesByCategoryNameAndMunicipioCodeController);
export default MetereoRouter;
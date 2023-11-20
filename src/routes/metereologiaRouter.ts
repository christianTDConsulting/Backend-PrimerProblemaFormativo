import express, { Router } from 'express';
import {getMunicipios, getApiKey, updateMunicipioInfo, getDetallesByMunicipioCodeController, getDetallesByMunicipioCodeAndDateController, getDetallesByCategoryNameAndMunicipioCodeController, getMunicpioInfo,getDetallesByCategoryNameAndMunicipioCodeAndDateController} from '../controller/metereologiaController';

const MetereoRouter:Router = express.Router();

MetereoRouter.get('/apiKey',getApiKey);
MetereoRouter.post('/addInfo/',updateMunicipioInfo);
MetereoRouter.get('/municipios/:codigo',getMunicpioInfo);
MetereoRouter.get('/municipios', getMunicipios);

MetereoRouter.get('/detalles/:code', getDetallesByMunicipioCodeController);
MetereoRouter.get('/detalles/:code/:fecha', getDetallesByMunicipioCodeAndDateController);
MetereoRouter.get('/detalles/:code/name/:categoryName', getDetallesByCategoryNameAndMunicipioCodeController);
MetereoRouter.get('/detalles/:code/:fecha/:categoryName', getDetallesByCategoryNameAndMunicipioCodeAndDateController);
export default MetereoRouter;
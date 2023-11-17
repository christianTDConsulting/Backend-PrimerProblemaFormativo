import express, { Router } from 'express';
import { getApiKey, updateMunicipioInfo, getDetallesByMunicipioCodeController, getDetallesByMunicipioCodeAndDateController, getDetallesByCategoryNameAndMunicipioCodeController, getMunicpioInfo} from '../controller/metereologiaController';

const MetereoRouter:Router = express.Router();

MetereoRouter.get('/apiKey',getApiKey);
MetereoRouter.post('/addInfo/',updateMunicipioInfo);
MetereoRouter.get('/municipios/:codigo',getMunicpioInfo);

MetereoRouter.get('/detalles/:code', getDetallesByMunicipioCodeController);
MetereoRouter.get('/detalles/:code/:fecha', getDetallesByMunicipioCodeAndDateController);
MetereoRouter.get('/detalles/:code/name/:categoryName', getDetallesByCategoryNameAndMunicipioCodeController);
export default MetereoRouter;
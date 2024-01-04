import express from 'express';
import {uploadCarteles, uploadMoviles} from '../config/multer';
import { getImagenes, postCartelImage, getCartelImagen, postImageMovil} from '../controller/ImageCheckerController';


  
const imageCheckerRouter = express.Router();

imageCheckerRouter.post('/uploadCartelImage', uploadCarteles, postCartelImage);
imageCheckerRouter.post('/uploadCartelHueco', uploadMoviles, postImageMovil);
imageCheckerRouter.get('/images', getImagenes);
imageCheckerRouter.get('/image/:image', getCartelImagen);

export default imageCheckerRouter;

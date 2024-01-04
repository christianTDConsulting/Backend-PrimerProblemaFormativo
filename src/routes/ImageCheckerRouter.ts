import express from 'express';
import {uploadCarteles, uploadMoviles} from '../config/multer';
import { getImages, postCartelImage, getImage, postImageMovil} from '../controller/ImageCheckerController';


  
const imageCheckerRouter = express.Router();

imageCheckerRouter.post('/uploadCartelImage', uploadCarteles, postCartelImage);
imageCheckerRouter.post('/uploadCartelHueco', uploadMoviles, postImageMovil);
imageCheckerRouter.get('/images', getImages);
imageCheckerRouter.get('/image/:image', getImage);

export default imageCheckerRouter;

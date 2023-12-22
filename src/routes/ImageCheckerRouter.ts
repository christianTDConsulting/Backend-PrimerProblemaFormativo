import express from 'express';
import upload from '../config/multer';
import { getImages, postImage, getImage } from '../controller/ImageCheckerController';


  
const imageCheckerRouter = express.Router();

imageCheckerRouter.post('/uploadImage', upload, postImage);
imageCheckerRouter.get('/images', getImages);
imageCheckerRouter.get('/image/:image', getImage);

export default imageCheckerRouter;

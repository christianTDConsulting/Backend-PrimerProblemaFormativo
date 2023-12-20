import express from 'express';
import upload from '../config/multer';
import { postImage } from '../controller/ImageCheckerController';


  
const imageCheckerRouter = express.Router();

imageCheckerRouter.post('/uploadImage', upload.single('image'), postImage);

export default imageCheckerRouter;

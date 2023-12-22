import multer from 'multer';
import path from 'path';


const storageImages = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'assets', 'images', 'carteles'),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = `${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});



// Middleware de Multer para manejar múltiples campos
const upload = multer({ 
  storage: storageImages, 
}).fields([
  { name: 'image' }, 
  { name: 'model', maxCount: 1 }
]);

export default  upload;

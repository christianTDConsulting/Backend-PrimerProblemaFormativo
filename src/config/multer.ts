import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'assets', 'images', 'politica'),

  
    
    filename: (_req, file, cb) => {
    
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileName = `${uniqueSuffix}${path.extname(file.originalname)}`;
      cb(null, fileName);
      
    },
  });
  
  
export default multer({ storage });
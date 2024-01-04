import multer from 'multer';
import path from 'path';

// Función para crear la configuración de almacenamiento
const createStorageConfig = (folderPath: string) => {
  return multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'assets', 'images', folderPath),
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileName = `${uniqueSuffix}${path.extname(file.originalname)}`;
      cb(null, fileName);
    },
  });
};

// Crear configuraciones de almacenamiento específicas
const storageImages = createStorageConfig('carteles');
const storageImagesMoviles = createStorageConfig('moviles');

// Middleware de Multer
const uploadCarteles  = multer({ storage: storageImages }).fields([
  { name: 'image' }, 
  { name: 'model', maxCount: 1 }
]);
const uploadMoviles = multer({ storage: storageImagesMoviles }).single('movilImage');


// Exportar los middleware
export { uploadCarteles, uploadMoviles };

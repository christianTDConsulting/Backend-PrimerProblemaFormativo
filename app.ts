import express from 'express';
import clienteRouter from './routes/clienteRoutes';
import tlfRouter from './routes/tlfRoutes';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/', clienteRouter);
app.use('/', tlfRouter);

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
import express from 'express';
import clienteRouter from './routes/clienteRoutes';
import tlfRouter from './routes/tlfRoutes';
import consumoRouter from './routes/consumoRoutes';
import authRouter from './routes/AuthRouter';
import usuarioRouter from './routes/usuarioRouter';
import logsRouter from './routes/logsRouter';
import MetereoRouter from './routes/metereologiaRouter'
import cors from 'cors';
import { tareaCrone } from './config/daily';

tareaCrone();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/', clienteRouter);
app.use('/', tlfRouter);
app.use('/', consumoRouter);
app.use('/', authRouter);
app.use('/', usuarioRouter);
app.use('/', logsRouter);
app.use('/', MetereoRouter )

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
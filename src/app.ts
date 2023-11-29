import express from 'express';
const bodyParser = require('body-parser');

import clienteRouter from './routes/clienteRoutes';
import tlfRouter from './routes/tlfRoutes';
import consumoRouter from './routes/consumoRoutes';
import authRouter from './routes/AuthRouter';
import usuarioRouter from './routes/usuarioRouter';
import logsRouter from './routes/logsRouter';
import metereoRouter from './routes/metereologiaRouter'
import empresaRouter from './routes/empresasAsociadasRouter';
import articuloRouter from './routes/articuloRouter';

import cors from 'cors';
import { tareaCron } from './config/daily';

tareaCron();

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/', clienteRouter);
app.use('/', tlfRouter);
app.use('/', consumoRouter);
app.use('/', authRouter);
app.use('/', usuarioRouter);
app.use('/', logsRouter);
app.use('/', metereoRouter );
app.use('/', empresaRouter);
app.use('/',articuloRouter);

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
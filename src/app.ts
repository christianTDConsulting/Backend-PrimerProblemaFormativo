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
import openAIRouter from './routes/openAIRouter';
import imageCheckerRouter from './routes/ImageCheckerRouter';

import { tareaCron } from './config/daily';

import cors from 'cors';


tareaCron();



const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

const port = process.env.PORT || 3000;
const backendName = process.env.BACKEND_NAME || 'localhost';
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
app.use('/',openAIRouter);
app.use('/', imageCheckerRouter);


app.listen(port, () => {
  console.log(`Servidor en ejecución en http://${backendName}:${port}`);
});
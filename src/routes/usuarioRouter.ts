import express, { Router } from 'express';
import { crearUsuario, editarUsuario, verUsuarios, verLogs, verificarUsuario, postLogs, getUsuarioById } from '../controller/usuarioController';
const usuarioRouter: Router = express.Router();

usuarioRouter.post('/usuarios', crearUsuario);
usuarioRouter.put('/usuarios', editarUsuario);
usuarioRouter.get('/usuarios/:id', getUsuarioById);
usuarioRouter.get('/usuarios', verUsuarios);
usuarioRouter.get('/logs', verLogs);
usuarioRouter.post('/logs',postLogs);
usuarioRouter.get('/verificar', verificarUsuario);

export default usuarioRouter;
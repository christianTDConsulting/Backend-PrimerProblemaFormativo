import express, { Router } from 'express';
import { crearUsuario, editarUsuario, verUsuarios, verLogs, verificarUsuario, /*postLogs,*/ getUsuarioById, crearUsuarioYCliente,getUsuarioByEmail, decodeToken} from '../controller/usuarioController';
const usuarioRouter: Router = express.Router();

usuarioRouter.post('/usuarios', crearUsuario);
usuarioRouter.put('/usuarios', editarUsuario);
usuarioRouter.get('/usuarios/:id', getUsuarioById);
usuarioRouter.get('/usuarios/:email', getUsuarioByEmail);
usuarioRouter.get('/usuarios', verUsuarios);
usuarioRouter.get('/logs', verLogs);
//usuarioRouter.post('/logs',postLogs);
usuarioRouter.post('/verificar', verificarUsuario);
usuarioRouter.get('/token/:token', decodeToken );
usuarioRouter.post('/usuarioCliente', crearUsuarioYCliente);
export default usuarioRouter;
import { Request, Response } from 'express';
import { crearUsuarioService, getUserByEmailService, editarUsuarioService, verUsuariosService, verLogsService, postLogService, getUsuarioByIdService} from '../service/usuarioService';
import * as bcrypt from 'bcryptjs';
async function crearUsuario(req: Request, res: Response) {
    try{
        const credentials = req.body;
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(credentials.plainPassword, saltRounds);
        await crearUsuarioService(hashedPassword, credentials.email);
        res.status(201).json({message: 'Usuario creado'});
        console.log("usuario creado");
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

async function editarUsuario(req: Request, res: Response) {
    try{
        const usuario = req.body; //Se pasa un usuario con una plainPassword
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(usuario.password, saltRounds);
        await editarUsuarioService(usuario.id, hashedPassword, usuario.email);
        res.status(201).json({message: 'Usuario editado'});
        console.log("usuario editado");
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}
async function verUsuarios(_req: Request, res: Response) {
    try{
        const usuarios = await verUsuariosService();
        res.status(200).json(usuarios);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

async function verLogs(_req: Request, res: Response) {
    try{
        const logs = await verLogsService();
        res.status(200).json(logs);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

async function postLogs(req: Request, res: Response) {
    try{
        const log = req.body;
        await postLogService(log);
        res.status(201).json({message: 'Log creado'});
        console.log("log creado");
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}

async function verificarUsuario(req: Request, res: Response) {
  try{
    const { email, plainPassword } = req.body;
   
    const user = await getUserByEmailService(email);
   if (user === null) {
     res.status(401).json({ message: 'Credenciales incorrectas' });
   }else{
    const passwordMatches = bcrypt.compareSync(plainPassword, user.password);
    
    if (passwordMatches) {
        res.status(200).json({ message: 'Credenciales correctas' });
    } else {
        res.status(401).json({ message: 'Credenciales incorrectas' });
    }
   }
    
    
  }catch(error){
    console.log(error);
    res.status(500).json(error);
  }
}

async function getUsuarioById(req: Request, res: Response) {
    try{
       const clienteId = parseInt(req.params.id);
       const cliente = await getUsuarioByIdService(clienteId);
       if (!cliente) {
         res.status(404).json({ error: 'Cliente no encontrado' }); 
         
       } else{
         res.status(200).json(cliente); // Envía el cliente como respuesta JSON
       }
    }catch(error){
       console.error('Error al obtener cliente ', error);
       res.status(500).json(error);
    }
   }
   

export {
    crearUsuario,
    editarUsuario,
    verUsuarios,
    verLogs,
    verificarUsuario,
    postLogs,
    getUsuarioById
}
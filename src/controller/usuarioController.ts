import { Request, Response } from 'express';
import {
     crearUsuarioService,
     getUserByEmailService,
     editarUsuarioService,
     verUsuariosService,
     verLogsService,
     getClienteFromUserService,
     //postLogService,
     getUsuarioByIdService,
     crearAdminService,
     //findLogByIpService,
     //updateLogService,
     } from '../service/usuarioService';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

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
async function crearAdmin(req: Request, res: Response) {

     try{
        const credentials = req.body;
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(credentials.plainPassword, saltRounds);
        await crearAdminService(hashedPassword, credentials.email);
        res.status(201).json({message: 'Admin creado'});
        console.log("Admin creado");
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

/*async function postLogs(req: Request, res: Response) {
    try{
        const log = req.body;
        const existingLog = await findLogByIpService(log.ip); //findLogByIpService devuelve los Logs de la ip
        if (existingLog && !existingLog.exito) {
            const currentDate = new Date();
            const logDate = existingLog.fecha;

            const  timeDifference = currentDate.getTime() - logDate.getTime();
            const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

            if (dayDifference >= 1) {
                // Reiniciar el número de intentos si ha pasado más de un día
                await updateLogService(existingLog.id, 1, currentDate);
              } else {
                await updateLogService(existingLog.id, (existingLog.intentos || 0) + 1, logDate);
              }

        // Si ya ha habido 5 intentos fallidos, bloquea al usuario
        if ((existingLog.intentos || 0) >= 4) {
            //bloquear IP
           
            }
        }else{
            await postLogService(log);
        }
        
        res.status(201).json({message: 'Log creado'});
        console.log("log creado");
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}
*/

async function verificarUsuario(req: Request, res: Response) {
  try{
    const { email, plainPassword } = req.body;
   
    const user = await getUserByEmailService(email);
   if (user === null) {
     res.status(401).json({ message: 'Credenciales incorrectas' });
   }else{
    const passwordMatches = bcrypt.compareSync(plainPassword, user.password);
    
    if (passwordMatches ) {

        //mandar por token
      
        // Crea un token JWT con la clave secreta
        const token = jwt.sign({ email: user.email}, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.status(200).json({ token });
        
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
   async function getUsuarioByEmail(req: Request, res: Response) {
    try{
       const email = req.params.email;
       const cliente = await getUserByEmailService(email);
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
   

 async function decodeToken(req: Request, res: Response) {
    try{
        const token = req.params.token;

        const decodedToken: JwtPayload  = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        const userEmail = decodedToken.email;
    
        const user = await getUserByEmailService(userEmail);
        if (user){
            const cliente = await getClienteFromUserService(user.id);
            if (cliente){
                res.status(200).json({ user, cliente });
            }else{
                res.status(404).json({ error: 'cliente no encontrado' });
            }
        }else{
            res.status(404).json({ error: 'usuario no encontrado' });
        }
        
        
    }catch(error){
        console.error('Error al decodificar el token', error);
        res.status(500).json(error);
    }
}

export {
    crearUsuario,
    editarUsuario,
    verUsuarios,
    verLogs,
    verificarUsuario,
   // postLogs,
    getUsuarioById,
    getUsuarioByEmail,
    crearAdmin,
    decodeToken
    
}
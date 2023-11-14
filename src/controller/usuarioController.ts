import { Request, Response } from 'express';
import {
  crearUsuarioService,
  getUserByEmailService,
  editarUsuarioService,
  verUsuariosService,
  getClienteFromUserService,
  getUsuarioByIdService,
  crearAdminService,

} from '../service/usuarioService';
import {
postLogService,
getBloqueoByIPService,
createBloqueo,
//deleteBloqueoByIPService,
countFailedLoginAttemptsByIp

} from '../service/logService';

import { createClienteService } from '../service/clienteService';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { JwtPayload } from 'jsonwebtoken';

/**
 * Crea un nuevo usuario en la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function crearUsuario(req: Request, res: Response) {
  try {
    const credentials = req.body;
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(credentials.plainPassword, saltRounds);
    await crearUsuarioService(hashedPassword, credentials.email);
    res.status(201).json({ message: 'Usuario creado' });
    console.log('Usuario creado');
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

/**
 * Crea un nuevo administrador en la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function crearAdmin(req: Request, res: Response) {
  try {
    const credentials = req.body;
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(credentials.plainPassword, saltRounds);
    await crearAdminService(hashedPassword, credentials.email);
    res.status(201).json({ message: 'Admin creado' });
    console.log('Admin creado');
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

/**
 * Edita un usuario en la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function editarUsuario(req: Request, res: Response) {
  try {
    const usuario = req.body; // Se pasa un usuario con una plainPassword
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(usuario.password, saltRounds);
    await editarUsuarioService(usuario.id, hashedPassword, usuario.email);
    res.status(201).json({ message: 'Usuario editado' });
    console.log('Usuario editado');
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

/**
 * Obtiene la lista de usuarios desde la base de datos.
 * @param _req - Objeto Request de Express (no utilizado).
 * @param res - Objeto Response de Express.
 */
async function verUsuarios(_req: Request, res: Response) {
  try {
    const usuarios = await verUsuariosService();
    res.status(200).json(usuarios);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}



/**
 * Verifica las credenciales de un usuario y devuelve un token JWT si son válidas, además se encarga de bloquear y desbloquear ips.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function verificarUsuario(req: Request, res: Response) {
  try {
    const { email, plainPassword } = req.body;
    const ip_address = req.ip;
   
    // Verificar si la IP está bloqueada
    if (await isIPBlocked(ip_address)) {
      return res.status(403).json({ message: 'IP bloqueada. Intenta nuevamente más tarde.' }); // 403 Forbidden
    }

    const user = await getUserByEmailService(email);

    // Manejar caso: Usuario no existe
    if (user === null) {
      await handleFailedLogin(email, ip_address);
      return res.status(401).json({ message: 'Credenciales incorrectas' }); // 401 Unauthorized
    }
   // Manejar caso: Usuario existe

    const passwordMatches = bcrypt.compareSync(plainPassword, user.password);
    // Manejar caso: Contraseña incorrecta
    if (!passwordMatches) {
      await handleFailedLogin(email, ip_address);
      return res.status(401).json({ message: 'Credenciales incorrectas' }); // 401 Unauthorized
    }

    // Usuario autenticado con éxito
    await handleSuccessfulLogin(email, ip_address);

    // Crea un token JWT con la clave secreta
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return res.status(200).json({ token }); // 200 OK

  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}


/**
 * Crea un log no exitoso y bloquea la IP si está bloqueada (solo si han pasado mas de 5 minutos).
 * @param email - La dirección de correo para el log.
 * @param ip_address - La dirección IP para el log y desbloquear.
 */
async function handleFailedLogin(email: string, ip_address: string) {
  const intentosBloqueo = parseInt(process.env.INTENTOS_BLOQUEO || '5', 10); // Minutos de bloqueo
  // Registra el intento fallido en logs
  await postLogService({
    email: email,
    exito: false,
    ip_address: ip_address,
  });

  // Bloquear la IP después de X intentos fallidos, solo se contaran si la fecha es del pasado x minutos
  const failedLoginCount = await countFailedLoginAttemptsByIp(ip_address);
  console.log(failedLoginCount);
  if (failedLoginCount >= intentosBloqueo) {
    console.log('IP bloqueada');
    await blockIP(ip_address);
  }
}

/**
 * Crea un log exitoso y desbloquea la IP si está bloqueada (solo si han pasado mas de 5 minutos).
 * @param email - La dirección de correo para el log.
 * @param ip_address - La dirección IP para el log y desbloquear.
 */

async function handleSuccessfulLogin(email: string, ip_address: string) {
  // Registra el intento exitoso en logs
  await postLogService({
    email: email,
    exito: true,
    ip_address: ip_address,
  });


  //await unblockIP(ip_address);
}



/**
 * Verifica si una IP está bloqueada.
 * @param ip_address - La dirección IP que se va a verificar.
 * @returns `true` si la IP está bloqueada, `false` si no está bloqueada.
 */
async function isIPBlocked(ip_address: string): Promise<boolean> {
  // Consulta el registro de bloqueo por la dirección IP.
  const block = await getBloqueoByIPService(ip_address);

  // Verifica si la IP está bloqueada y el bloqueo es válido.
  if (block && block.fecha_hasta) {
    const now = new Date();
 
  // IP bloqueada si la diferencia es menor o igual a 5 minutos entre la fecha del bloqueo con la fecha actual
    return now <=  block.fecha_hasta;
  }

  return false; // IP no bloqueada
}

/**
 * Bloquea una IP durante x minutos.
 * @param ip_address - La dirección IP que se va a bloquear.
 * * @param bloqueo_hasta - La fecha hasta la cual se bloqueará la IP.
 */
async function blockIP(ip_address: string): Promise<void> {
  const minutesBloqueados = parseInt(process.env.MINUTOS_BLOQUEO || '5', 10); // Minutos de bloqueo
  
  const bloqueo_hasta = new Date();
  bloqueo_hasta.setMinutes(bloqueo_hasta.getMinutes() + minutesBloqueados);

  // Crea un nuevo registro de bloqueo en la base de datos.
  await createBloqueo( ip_address, bloqueo_hasta );
}

/**
 * Desbloquea una IP.
 * @param ip_address - La dirección IP que se va a desbloquear.
 */
/*
async function unblockIP(ip_address: string): Promise<void> {
  // Elimina el registro de bloqueo asociado a la dirección IP.
  await deleteBloqueoByIPService(ip_address);
}
*/


/**
 * Obtiene un usuario por su ID desde la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function getUsuarioById(req: Request, res: Response) {
  try {
    const clienteId = parseInt(req.params.id);
    const cliente = await getUsuarioByIdService(clienteId);
    if (!cliente) {
      res.status(404).json({ error: 'Cliente no encontrado' });
    } else {
      res.status(200).json(cliente);
    }
  } catch (error) {
    console.error('Error al obtener cliente ', error);
    res.status(500).json(error);
  }
}

/**
 * Obtiene un usuario por su dirección de correo electrónico desde la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function getUsuarioByEmail(req: Request, res: Response) {
  try {
    const email = req.params.email;
    const cliente = await getUserByEmailService(email);
    if (!cliente) {
      res.status(404).json({ error: 'Cliente no encontrado' });
    } else {
      res.status(200).json(cliente);
    }
  } catch (error) {
    console.error('Error al obtener cliente ', error);
    res.status(500).json(error);
  }
}

/**
 * Decodifica un token JWT y devuelve información del usuario asociado.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function decodeToken(req: Request, res: Response) {
  try {
    const token = req.params.token;
    const decodedToken: JwtPayload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userEmail = decodedToken.email;
    const user = await getUserByEmailService(userEmail);

    if (user) {
      const cliente = await getClienteFromUserService(user.id);

      if (cliente) {
        res.status(200).json({
          id: cliente.id,
          usuario: user,
          nombre: cliente.nombre,
          bio: cliente.bio,
          nacimiento: cliente.nacimiento,
          visible: cliente.visible,
        });
      } else {
        if (user.id_perfil === 2) {
          res.status(200).json({ usuario: user });
        } else {
          res.status(404).json({ error: 'cliente no encontrado' });
        }
      }
    } else {
      res.status(404).json({ error: 'usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al decodificar el token', error);
    res.status(500).json(error);
  }
}

/**
 * Crea un nuevo usuario y cliente en la base de datos.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function crearUsuarioYCliente(req: Request, res: Response) {
  try {
    const { usuarioData, clienteData } = req.body;
    const existingUser = await getUserByEmailService(usuarioData.email);

    if (existingUser) {
      res.status(400).json({ error: 'El usuario ya existe' });
    } else {
      // Crea el usuario en la base de datos
      const saltRounds = 10;
      const hashedPassword = bcrypt.hashSync(usuarioData.plainPassword, saltRounds);
      const nuevoUsuario = await crearUsuarioService(hashedPassword, usuarioData.email);

      // Crea el cliente en la base de datos y lo relaciona con el usuario
      const insertarCliente = {
        ...clienteData,
        id_usuario: nuevoUsuario.id,
      };
      const nuevoCliente = await createClienteService(insertarCliente);

      res.status(201).json({ usuario: nuevoUsuario, cliente: nuevoCliente });
    }
  } catch (error) {
    console.error('Error al crear usuario y cliente', error);
    res.status(500).json({ error: 'Error al crear usuario y cliente' });
  }
}

export {
  crearUsuario,
  editarUsuario,
  verUsuarios,
  verificarUsuario,
  getUsuarioById,
  getUsuarioByEmail,
  crearAdmin,
  decodeToken,
  crearUsuarioYCliente,
};

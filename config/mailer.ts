const { createTransport } = require('nodemailer');

const transporter = createTransport({
    host: process.env.HOST_MAIL,
    port: process.env.PORT_MAIL, // Puerto seguro para Office 365
    secure: true, // Establecido en true para habilitar SSL
    auth: {
      user: process.env.MY_EMAIL, // Tu dirección de correo electrónico
      pass: process.env.MY_PSW // Tu contraseña
    }
  });

  
  transporter.verify().then(() => {
      console.log('Server is ready to take our messages');
  })

  export {
    transporter
  }
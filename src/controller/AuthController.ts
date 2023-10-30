import { Request, Response } from 'express';
import { transporter } from "../../config/mailer";



  async function sendMail(req: Request, res: Response) {
  try{
    
    const {email, file} = req.body; 
     await transporter.sendMail({
        from: process.env.MY_EMAIL,
        to: email, // Dirección del destinatario
        subject: 'Consumos telefónicos',
        text: 'Buenas, Estos son sus datos de consumos teléfonicos. Un saludo',
        attachments:  [
          {
            filename: 'Consumos.pdf',
            content: file,
            
          }
        ]
      });
      
    
      res.status(200).json("Email enviado");

  } catch(error){
    console.error('Error al enviar correo', error);
    res.status(500).json(error);
  }
}

export {sendMail};
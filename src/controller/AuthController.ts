import { Request, Response } from 'express';
import { transporter } from "../config/mailer";

/**
 * Envía un correo electrónico con un archivo adjunto.
 * @param req - Objeto Request de Express.
 * @param res - Objeto Response de Express.
 */
async function sendMail(req: Request, res: Response) {
  try {
    const { email, file } = req.body;

    await transporter.sendMail({
      from: process.env.MY_EMAIL,
      to: email, // Dirección del destinatario
      subject: 'Consumos telefónicos',
      text: 'Buenas, Estos son sus datos de consumos telefónicos. Un saludo',
      attachments: [
        {
          filename: 'Consumos.pdf',
          content: Buffer.from(file, 'base64'),
        }
      ]
    });

    res.status(200).json("Email enviado");

  } catch (error) {
    console.error('Error al enviar correo', error);
    res.status(500).json(error);
  }
}

export { sendMail };

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const mailer_1 = require("../../config/mailer");
function sendMail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, file } = req.body;
            yield mailer_1.transporter.sendMail({
                from: process.env.MY_EMAIL,
                to: email,
                subject: 'Consumos telefónicos',
                text: 'Buenas, Estos son sus datos de consumos teléfonicos. Un saludo',
                attachments: [
                    {
                        filename: 'Consumos.pdf',
                        content: file,
                    }
                ]
            });
            res.status(200).json("Email enviado");
        }
        catch (error) {
            console.error('Error al enviar correo', error);
            res.status(500).json(error);
        }
    });
}
exports.sendMail = sendMail;

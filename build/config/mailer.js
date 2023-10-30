"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const { createTransport } = require('nodemailer');
const transporter = createTransport({
    host: process.env.HOST_MAIL,
    port: process.env.PORT_MAIL,
    secure: true,
    auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PSW // Tu contraseña
    }
});
exports.transporter = transporter;
transporter.verify().then(() => {
    console.log('Server is ready to take our messages');
});

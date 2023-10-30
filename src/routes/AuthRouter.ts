import express, { Router } from 'express';
import { sendMail } from '../controller/AuthController';

const authRouter: Router = express.Router();

authRouter.post('/email', sendMail);

export default authRouter;
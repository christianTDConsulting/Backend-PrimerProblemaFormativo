

import axios from "axios";
import { Request, Response } from "express";

export async function askGepeto(req: Request, res: Response) {
   

    // TODO: Use try-catch block to catch any errors
    try {
        const {prompt} = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'No prompt provided' });
        }
        console.log(prompt);
        const gptUrl = process.env.GPT_MODEL_URL || 'https://chat.openai.com/g/g-1PW5FjOoR-asesor-tech';

        const response = await axios.post(gptUrl, { prompt }, {
            headers: {
              'Authorization': `Bearer ${process.env.API_KEY_GPT}`
            }
          });
          
        console.log(response.data);
        return res.status(200).json(response.data);
    } catch (error) {
        // TODO: Handle the error and send an appropriate response
        return res.status(500).json({ error: 'An error occurred' });
    }
}


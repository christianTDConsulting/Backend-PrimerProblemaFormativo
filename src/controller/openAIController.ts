

import openai from "../config/openAi";
import { Request, Response } from "express";

export async function askGepeto(req: Request, res: Response) {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'No prompt provided' });
        }

        const response = await openai.completions.create({
            messages:[{
                role: "user",
                content: prompt
            }],
            model: "gpt-3.5-turbo-0613",
            max_tokens: 50,
        } as any); // Conversión de tipo

        console.log(response);
        return res.status(200).json(response.choices[0].text);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
}

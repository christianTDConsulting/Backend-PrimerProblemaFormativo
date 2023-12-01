import { OpenAI } from "openai";


const openai = new OpenAI({ apiKey: process.env.API_KEY_GPT});

export default openai
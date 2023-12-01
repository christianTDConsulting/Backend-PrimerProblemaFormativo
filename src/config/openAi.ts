import { OpenAI } from "openai";

const api_key = process.env.API_KEY_GPT || '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';

const openai = new OpenAI({ apiKey: api_key });

export default openai
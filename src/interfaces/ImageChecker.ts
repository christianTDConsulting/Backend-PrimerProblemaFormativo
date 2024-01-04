
export type ChatMessage = { type: 'text', text: string } | { type: 'image_url', image_url: { url: string } };

export interface Movil {
    numero: number;
    x: number;
    y: number;
  }
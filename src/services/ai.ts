import { apiRequest } from './api';
import type { Venue } from '../data/venues';

export type AiChatMessage = {
  role: 'assistant' | 'customer';
  text: string;
};

type VenueChatResponse = {
  reply: string;
  recommendations: Venue[];
};

export async function sendVenueChat(message: string, history: AiChatMessage[]) {
  return apiRequest<VenueChatResponse>('/api/ai/venue-chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      history: history.map((item) => ({
        role: item.role === 'assistant' ? 'assistant' : 'user',
        content: item.text,
      })),
    }),
  });
}

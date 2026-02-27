import { api } from 'boot/axios';

import type { AxiosResponse } from 'axios';
import type { Card } from 'src/models/cards';

export interface PaginatedResponse<T> {
  list: T[];
  page: number;
  rpp: number;
  more: boolean;
}

export const getMyCards = (): Promise<AxiosResponse<Card[]>> => {
  return api.get('/me/cards');
};

export const getAvailableCards = (
  page: number = 1,
  rpp: number = 10,
): Promise<AxiosResponse<PaginatedResponse<Card>>> => {
  return api.get('/cards', {
    params: { page, rpp },
  });
};

export const addCard = (cardId: string): Promise<AxiosResponse<Card>> => {
  return api.post('/me/cards', {
    cardIds: [cardId],
  });
};

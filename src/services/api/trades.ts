import { api } from 'boot/axios';

import type { AxiosResponse } from 'axios';
import type { Card } from 'src/models/cards';

export interface TradeCard {
  id: string;
  cardId: string;
  tradeId: string;
  type: 'OFFERING' | 'RECEIVING';
  card: Card;
}

export interface Trade {
  id: string;
  userId: string;
  createdAt: string;
  user: {
    name: string;
  };
  tradeCards: TradeCard[];
}

export interface PaginatedResponse<T> {
  list: T[];
  page: number;
  rpp: number;
  more: boolean;
}

export interface CreateTradeData {
  cards: {
    cardId: string;
    type: 'OFFERING' | 'RECEIVING';
  }[];
}

export const getTrades = (
  page: number = 1,
  rpp: number = 10,
): Promise<AxiosResponse<PaginatedResponse<Trade>>> => {
  return api.get('/trades', {
    params: { page, rpp },
  });
};

export const createTrade = (data: CreateTradeData): Promise<AxiosResponse<Trade>> => {
  return api.post('/trades', data);
};

export const deleteTrade = (tradeId: string): Promise<AxiosResponse<void>> => {
  return api.delete(`/trades/${tradeId}`);
};

import api from './api';
import { StandardResponse, User, PaginationParams } from './types';

export interface Nostalgia {
  id: number;
  title: string;
  summary: string;
  participants: User[];
  created_at: string;
}

export interface NostalgiaCreate {
  title: string;
  summary: string;
  participants: number[]; // array of user IDs
}

export interface NostalgiaUpdate {
  title?: string;
  summary?: string;
  participants?: number[];
}

export const nostalgia = {
  async create(data: NostalgiaCreate): Promise<StandardResponse<Nostalgia>> {
    try {
      const response = await api.post('/nostalgia', data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create nostalgia'
      };
    }
  },

  async list(params?: PaginationParams): Promise<StandardResponse<Nostalgia[]>> {
    try {
      const response = await api.get('/nostalgia', {
        params: {
          skip: params?.skip ?? 0,
          limit: params?.limit ?? 100
        }
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch nostalgias',
        data: []
      };
    }
  },

  async get(id: number): Promise<StandardResponse<Nostalgia>> {
    try {
      const response = await api.get(`/nostalgia/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch nostalgia'
      };
    }
  },

  async update(id: number, data: NostalgiaUpdate): Promise<StandardResponse<Nostalgia>> {
    try {
      const response = await api.put(`/nostalgia/${id}`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update nostalgia'
      };
    }
  },

  async delete(id: number): Promise<StandardResponse<void>> {
    try {
      await api.delete(`/nostalgia/${id}`);
      return {
        success: true,
        message: 'Nostalgia deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete nostalgia'
      };
    }
  }
};
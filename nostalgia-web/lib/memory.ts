import api from './api';
import { StandardResponse, PaginationParams, User } from './types';

export interface Artifact {
  id: number;
  type: string;
  url: string;
}

export interface Memory {
  id: number;
  nostalgia_id: number;
  content: string;
  summary: string;
  mood: string | null;
  created_at: string;
  created_by: User;
  artifacts: Artifact[];
  mood_emoji: string | null;
}

export interface NostalgiaWithMemories {
  id: number;
  title: string;
  summary: string;
  created_at: string;
  last_updated: string;
  participants: User[];
  memories: Memory[];
}

export interface MemoryCreate {
  nostalgia_id: number;
  content: string;
  summary: string;
  mood: string | null;
  mood_emoji: string | null;
}

export interface MemoryUpdate {
  content?: string;
  summary?: string;
}

export const memory = {
  async create(data: MemoryCreate): Promise<StandardResponse<Memory>> {
    try {
      const response = await api.post('/memory', data);
      return response.data;
    } catch (error) {
      return  {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create memory',
        message: error instanceof Error ? error.message : 'Failed to create memory'
      };
    }
  },

  async listByNostalgia(
    nostalgiaId: number, 
    params?: PaginationParams
  ): Promise<StandardResponse<NostalgiaWithMemories>> {
    try {
      const response = await api.get(`/memory/nostalgia/${nostalgiaId}`, {
        params: {
          skip: params?.skip ?? 0,
          limit: params?.limit ?? 100
        }
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch memories',
        data: undefined
      };
    }
  },

  async get(id: number): Promise<StandardResponse<Memory>> {
    try {
      const response = await api.get(`/memory/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch memory'
      };
    }
  },

  async update(id: number, data: MemoryUpdate): Promise<StandardResponse<Memory>> {
    try {
      const response = await api.put(`/memory/${id}`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update memory'
      };
    }
  },

  async delete(id: number): Promise<StandardResponse<void>> {
    try {
      await api.delete(`/memory/${id}`);
      return {
        success: true,
        message: 'Memory deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete memory'
      };
    }
  }
};
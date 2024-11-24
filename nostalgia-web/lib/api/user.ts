import api from '@/lib/api';
import type { StandardResponse, User, InviteResponse } from '@/lib/types';

export async function searchUsers(query: string): Promise<User[]> {
  try {
    const { data } = await api.get<StandardResponse<User[]>>(`/user/search`, {
      params: { query }
    });
    
    return data.data || [];
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
}

export async function sendConnectionInvite(receiverId: number): Promise<InviteResponse['data']> {
  try {
    const { data } = await api.post<InviteResponse>('/user/invite', {
      receiver_id: receiverId
    });
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to send invitation');
    }
    
    return data.data;
  } catch (error) {
    console.error('Failed to send invitation:', error);
    throw error;
  }
}

export async function listInvites(): Promise<InviteResponse['data'][]> {
  try {
    const { data } = await api.get<{
      success: boolean;
      message: string;
      data: InviteResponse['data'][];
      error: null;
    }>('/user/invites');
    
    return data.data;
  } catch (error) {
    console.error('Failed to fetch invites:', error);
    throw error;
  }
}

export async function acceptInvite(inviteId: number): Promise<InviteResponse['data']> {
  try {
    const { data } = await api.put<InviteResponse>(`/user/invites/${inviteId}/accept`);
    return data.data;
  } catch (error) {
    console.error('Failed to accept invite:', error);
    throw error;
  }
}

export type { User }; 
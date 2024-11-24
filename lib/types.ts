export interface User {
  id: number;
  email: string;
  username: string;
  avatar_url: string;
  name: string;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface StandardResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface InviteResponse {
  success: boolean;
  message: string;
  error: string | null;
  data: {
    id: number;
    status: string;
    created_at: string;
    sender: {
      id: number;
      username: string;
      email: string;
    };
    receiver: {
      id: number;
      username: string;
      email: string;
    };
  };
}
import api from './api';

export interface Artifact {
  id: number;
  type: "IMAGE" | "SONG" | "TEXT";
  url: string;
  memory_id: number;
  summary: string;
}

export const artifact = {
  async upload(file: File, memoryId: number) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('memory_id', String(memoryId));
    
    const response = await api.post('/artifact/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
import axios from 'axios';
import { Note, CreateNoteDTO, UpdateNoteDTO } from '@/types/Note';

// **IMPORTANTE:** Substitua 'SEU_IP_LOCAL' pelo endereço de IP da sua máquina!
const API_URL = 'http://SEU_IP_LOCAL:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getNotes = async (): Promise<Note[]> => {
  try {
    const response = await apiClient.get<Note[]>('/notas/');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar notas da API:', error);
    throw new Error('Não foi possível carregar as notas do servidor.');
  }
};

export const getNoteById = async (id: string): Promise<Note | null> => {
    try {
        const response = await apiClient.get<Note>(`/notas/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar a nota ${id}:`, error);

        return null;
    }
};

export const createNote = async (noteData: CreateNoteDTO): Promise<Note> => {
  try {
    const response = await apiClient.post<Note>('/notas/', noteData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar nota na API:', error);
    throw new Error('Não foi possível criar a nota no servidor.');
  }
};

export const updateNote = async (id: string, noteData: UpdateNoteDTO): Promise<Note> => {
  try {
    const response = await apiClient.put<Note>(`/notas/${id}`, noteData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar a nota ${id}:`, error);
    throw new Error('Não foi possível atualizar a nota no servidor.');
  }
};

export const deleteNote = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/notas/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar a nota ${id}:`, error);
    throw new Error('Não foi possível deletar a nota no servidor.');
  }
};
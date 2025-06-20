import axios from 'axios';
import { Note, CreateNoteDTO, UpdateNoteDTO } from '@/types/Note';

// **IMPORTANTE:** Substitua 'localhost' pelo endereço de IP da sua máquina se quiser testar usando o celular com o Expo Go
const API_URL = 'http://localhost:8000';

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

export const getNoteById = async (id: number): Promise<Note | null> => {
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

export const updateNote = async (id: number, noteData: UpdateNoteDTO): Promise<Note> => {
  try {
    const response = await apiClient.put<Note>(`/notas/${id}`, noteData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar a nota ${id}:`, error);
    throw new Error('Não foi possível atualizar a nota no servidor.');
  }
};

export const deleteNote = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/notas/${id}`);
  } catch (error) {
    console.error(`Erro ao deletar a nota ${id}:`, error);
    throw new Error('Não foi possível deletar a nota no servidor.');
  }
};
import api from '@/lib/api';
import { User, Agency, Lead, AuthResponse, PaginatedResponse } from '@/types';

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    agencyId: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

// Users API
export const usersApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },
  
  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  createUser: async (userData: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    agencyId: string;
  }): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Agencies API
export const agenciesApi = {
  getAgencies: async (): Promise<Agency[]> => {
    const response = await api.get('/agencies');
    return response.data;
  },
  
  getAgency: async (id: string): Promise<Agency> => {
    const response = await api.get(`/agencies/${id}`);
    return response.data;
  },
  
  createAgency: async (agencyData: {
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  }): Promise<Agency> => {
    const response = await api.post('/agencies', agencyData);
    return response.data;
  },
  
  deleteAgency: async (id: string): Promise<void> => {
    await api.delete(`/agencies/${id}`);
  },
  
  getAgencyStats: async (id: string): Promise<any> => {
    const response = await api.get(`/agencies/${id}/stats`);
    return response.data;
  },
};

// Leads API
export const leadsApi = {
  getLeads: async (): Promise<Lead[]> => {
    const response = await api.get('/leads');
    return response.data;
  },
  
  getLead: async (id: string): Promise<Lead> => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },
  
  createLead: async (leadData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    status: string;
    source?: string;
    budget?: number;
    notes?: string;
    agencyId: string;
    assignedToId?: string;
  }): Promise<Lead> => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },
  
  updateLead: async (id: string, leadData: Partial<Lead>): Promise<Lead> => {
    const response = await api.put(`/leads/${id}`, leadData);
    return response.data;
  },
  
  deleteLead: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },
};

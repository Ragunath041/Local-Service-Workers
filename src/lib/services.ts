import axios from 'axios';
import { API_URL } from "@/config";

export interface Service {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  workerId: string;
  workerName?: string;
  workerEmail?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  providerName: string;
  providerEmail: string;
  providerPhone: string;
}

export interface CreateServiceData {
  title: string;
  description: string;
  price: string;
  category: string;
  location: string;
  workerId: string;
}

export type UpdateServiceData = Omit<CreateServiceData, 'workerId'>;

export const servicesApi = {
  async createService(data: CreateServiceData): Promise<Service> {
    const response = await axios.post(`${API_URL}/services`, data);
    return response.data.service;
  },

  async getService(serviceId: string): Promise<Service> {
    const response = await axios.get(`${API_URL}/services/${serviceId}`);
    return response.data;
  },

  async updateService(serviceId: string, data: UpdateServiceData): Promise<Service> {
    const response = await axios.put(`${API_URL}/services/${serviceId}`, data);
    return response.data.service;
  },

  async getWorkerServices(workerId: string): Promise<Service[]> {
    const response = await axios.get(`${API_URL}/worker/${workerId}/services`);
    return response.data;
  },

  async getApprovedServices(): Promise<Service[]> {
    const response = await axios.get(`${API_URL}/services/approved`);
    return response.data;
  },

  async getPendingServices(): Promise<Service[]> {
    const response = await axios.get(`${API_URL}/services/pending`);
    return response.data;
  },

  async approveService(serviceId: string): Promise<void> {
    await axios.post(`${API_URL}/services/${serviceId}/approve`);
  },

  async rejectService(serviceId: string): Promise<void> {
    await axios.post(`${API_URL}/services/${serviceId}/reject`);
  },

  async getServiceCategories(): Promise<string[]> {
    const response = await axios.get(`${API_URL}/services/categories`);
    return response.data;
  },

  async getServicesByCategory(category: string): Promise<Service[]> {
    const response = await axios.get(`${API_URL}/services/category/${category}`);
    return response.data;
  },
}; 
import { API_URL } from "@/config";

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  serviceId?: string;
  createdAt: string;
  read: boolean;
  otherPartyName?: string;
}

export interface CreateMessageData {
  senderId: string;
  receiverId: string;
  content: string;
  serviceId?: string;
}

export const messagesApi = {
  createMessage: async (data: CreateMessageData): Promise<Message> => {
    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    const result = await response.json();
    return result.data;
  },

  getUserMessages: async (userId: string): Promise<Message[]> => {
    const response = await fetch(`${API_URL}/messages/user/${userId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch messages');
    }

    return response.json();
  },

  getWorkerMessages: async (workerId: string): Promise<Message[]> => {
    const response = await fetch(`${API_URL}/messages/worker/${workerId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch messages');
    }

    return response.json();
  },

  getUnreadCount: async (userId: string): Promise<number> => {
    const response = await fetch(`${API_URL}/messages/unread/${userId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch unread count');
    }

    const data = await response.json();
    return data.unreadCount;
  },

  markAsRead: async (messageId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/messages/${messageId}/read`, {
      method: 'PUT',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to mark message as read');
    }
  },
}; 
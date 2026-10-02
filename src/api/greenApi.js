import axios from 'axios';

const API_URL = '/api';

export const greenApi = {
  getSettings: async (idInstance, apiTokenInstance) => {
    const url = `${API_URL}/waInstance${idInstance}/getSettings/${apiTokenInstance}`;
    return axios.get(url);
  },

  checkAccount: async (idInstance, apiTokenInstance, phoneNumber) => {
    const url = `${API_URL}/waInstance${idInstance}/checkAccount/${apiTokenInstance}`;
    return axios.post(url, {
      phoneNumber: Number(phoneNumber),
      force: true,
    });
  },

  sendMessage: async (idInstance, apiTokenInstance, chatId, message) => {
    const url = `${API_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
    return axios.post(url, { chatId, message });
  },

  receiveNotification: async (idInstance, apiTokenInstance) => {
    const url = `${API_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`;
    return axios.get(url);
  },

  deleteNotification: async (idInstance, apiTokenInstance, receiptId) => {
    const url = `${API_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;
    return axios.delete(url);
  },
};
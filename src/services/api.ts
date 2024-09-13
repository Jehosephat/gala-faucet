import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Adjust this to match your backend URL

export const api = {
  async getBalance(): Promise<number> {
    const response = await axios.get(`${API_URL}/getBalance`);
    return response.data;
  },

  async burnMainnetGala(amount: number): Promise<boolean> {
    const response = await axios.post(`${API_URL}/burnMainnetGala`, { amount });
    return response.data;
  },
};
import axios from 'axios';
import ResupplyPlan from '../model/resupply-plan.entity.js';

const API_URL = 'http://localhost:3000';

export default {
  async getAll() {
    const response = await axios.get(`${API_URL}/resupplyPlans`);
    return response.data.map(plan => new ResupplyPlan(plan));
  },
  async getExpiringSoon(days = 3) {
    const response = await axios.get(`${API_URL}/resupplyPlans`);
    const data = Array.isArray(response.data) ? response.data : [];
    const now = new Date();
    const soon = new Date(now);
    soon.setDate(now.getDate() + days);
    return data
      .filter(plan => {
        const vencimiento = new Date(plan.fechaVencimiento);
        return vencimiento >= now && vencimiento <= soon;
      })
      .map(plan => new ResupplyPlan(plan));
  }
};
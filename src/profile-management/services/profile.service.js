import axios from 'axios';
import { isFrontendOnly } from '@/shared/config/frontend-only.js';

const apiUrl = import.meta.env.VITE_API_URL;
const profileEndpoint = import.meta.env.VITE_PROFILE_ENDPOINT_PATH;

const mockProfile = (profileId = '0') => ({
  profileId,
  userId: profileId,
  name: 'Demo',
  email: 'demo@local.dev',
  businessName: 'Demo Bodega',
  businessAddress: 'Av. Demo 123',
  phone: '+51 900 000 000',
});

class ProfileService {
  async getProfileById(profileId) {
    if (isFrontendOnly()) {
      return mockProfile(String(profileId));
    }
    try {
      const response = await axios.get(`${apiUrl}${profileEndpoint}/${profileId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  async editProfile(profile) {
    if (isFrontendOnly()) {
      return { ...mockProfile(profile.profileId), ...profile };
    }
    try {
      const response = await axios.put(`${apiUrl}${profileEndpoint}/${profile.profileId}`, profile);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}

export default new ProfileService();

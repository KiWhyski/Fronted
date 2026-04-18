import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const profileEndpoint = import.meta.env.VITE_PROFILE_ENDPOINT_PATH;

class ProfileService {
    async getProfileById(profileId) {
        try {
            const response = await axios.get(`${apiUrl}${profileEndpoint}/${profileId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    }

    async editProfile(profile) {
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

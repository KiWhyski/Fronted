import axios from 'axios';

const cloudName = 'dmhlgoedk';
const uploadPreset = 'conservation';

export default {
    async uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
        return response.data;
    }
};
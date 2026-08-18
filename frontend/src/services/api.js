import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const extractFeaturesFromFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_BASE_URL}/extract-features`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const extractFeaturesFromCanvas = async (base64Image) => {
  const response = await axios.post(`${API_BASE_URL}/extract-features-base64`, {
    image_base64: base64Image,
  });
  return response.data;
};

export const getSampleImages = async () => {
  const response = await axios.get(`${API_BASE_URL}/sample-images`);
  return response.data;
};

export const extractSampleDigitFeatures = async (digit) => {
  const response = await axios.get(`${API_BASE_URL}/sample-images/${digit}`);
  return response.data;
};

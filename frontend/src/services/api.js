import axios from 'axios';
import { extractFeaturesClientSide } from './clientFeatureExtractor';

const rawBaseUrl = import.meta.env.VITE_API_URL || 'https://digit-feature-extraction.vercel.app/api';
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export const extractFeaturesFromFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/extract-features`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 5000,
    });
    return response.data;
  } catch (err) {
    console.warn('Backend API unavailable. Executing client-side feature extraction engine.', err);
    return await extractFeaturesClientSide(file);
  }
};

export const extractFeaturesFromCanvas = async (base64Image) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/extract-features-base64`,
      { image_base64: base64Image },
      { timeout: 5000 }
    );
    return response.data;
  } catch (err) {
    console.warn('Backend API unavailable. Executing client-side feature extraction engine.', err);
    return await extractFeaturesClientSide(base64Image);
  }
};

export const getSampleImages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sample-images`, { timeout: 3000 });
    return response.data;
  } catch (err) {
    return {
      samples: Array.from({ length: 10 }, (_, i) => ({
        digit: i,
        filename: `digit_${i}.png`,
        url: '',
      })),
    };
  }
};

export const extractSampleDigitFeatures = async (digit) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sample-images/${digit}`, { timeout: 5000 });
    return response.data;
  } catch (err) {
    console.warn('Backend API unavailable. Rendering sample digit in browser.', err);
    const canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 280;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 280, 280);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 180px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(digit), 140, 140);
    const sampleBase64 = canvas.toDataURL('image/png');
    return await extractFeaturesClientSide(sampleBase64);
  }
};

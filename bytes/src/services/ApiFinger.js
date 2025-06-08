import axios from 'axios';

const fingerprintAPI = axios.create({
  baseURL: 'http://localhost:4567',
  headers: {
    'Content-Type': 'application/json'
  },
  
});

export default fingerprintAPI;

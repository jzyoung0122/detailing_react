import axios from 'axios';

const http = axios.create({
  // baseURL: '/api',
  baseURL: '/',
});

export default http;
import axios from 'axios';
import { publicPath } from '../lib/public-path';

export const axiosInstance = axios.create({
  baseURL: publicPath,
});


import axios from 'axios'


const API = axios.create({ baseURL: 'http://localhost:5001' });

export const logIn = (formData) => API.post('/login', formData);

export const signUp = (formData) => API.post('/register', formData);

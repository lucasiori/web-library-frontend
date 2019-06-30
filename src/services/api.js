import axios from 'axios';

const api = axios.create({
    baseURL: "https://weblibrary-backend.herokuapp.com",
});

export default api;
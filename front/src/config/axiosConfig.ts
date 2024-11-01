import axios, { AxiosInstance } from 'axios';

// Define la configuración de Axios
const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api/expedients', // Cambia esto si es necesario
    headers: {
        'Content-Type': 'application/json',
    },
});

// Puedes agregar interceptores si es necesario
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Manejo de errores global
        return Promise.reject(error);
    }
);

export default axiosInstance;

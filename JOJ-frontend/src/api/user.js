import axios from 'axios';

// Récupère le token depuis le localStorage (ou là où vous le stockez)
const getAuthToken = () => {
    // Adaptez la clé si vous utilisez un autre nom
    const tokenData = JSON.parse(localStorage.getItem('authTokens'));
    return tokenData ? tokenData.access : null;
};

// Crée une instance Axios avec le token dans les headers
const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Adaptez si votre URL de base est différente
});

api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Fonction pour récupérer le profil de l'utilisateur connecté
export const getProfile = () => api.get('/auth/profil/');
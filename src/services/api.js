import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_URL,
});

export const signup = (data) => api.post('/v1/auth/signup', data);
export const signin = (data) => api.post('/v1/auth/signin', data);

export const createPet = (petData, token) => {
  return axios.post(`${API_URL}/pet/new`, petData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

  export const getUserPets = (userId, token) => {
    return api.get(`/pet/getUserPets?userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  export const getAll = (token) => 
    api.get('/pet/getAll', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    export const updatePet = (petId, userId, petUpdateRequest, token) => {
      if (!token || !userId) {
        console.error("User not authenticated or token missing.");
        return Promise.reject("Authentication required");
      }
    
      return axios.put(`/api/pet/update?userId=${userId}&petId=${petId}`, petUpdateRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    };
    
    // Función para obtener los detalles de la mascota
    export const getPetDetails = (userId, petId, token) => {
      return api.get('/pet/get', {
        params: { userId, petId },
        headers: { Authorization: `Bearer ${token}` },
      });
    };

    export const deletePet = (petId, token) => {
      return axios.delete('/api/pet/delete', {
        params: {
          petId: petId,  // Solo pasamos el petId
        },
        headers: {
          Authorization: `Bearer ${token}`,  // Asegúrate de que el token esté presente
        }
      });
    };
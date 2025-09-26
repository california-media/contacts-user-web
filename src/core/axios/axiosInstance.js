import axios from "axios";

const api = axios.create({
  baseURL: "https://100rjobf76.execute-api.eu-north-1.amazonaws.com/",
  // baseURL: "http://localhost:3003/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

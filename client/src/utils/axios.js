import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let subscribers = [];

function onAccessTokenFetched(token) {
  subscribers.forEach(callback => callback(token));
  subscribers = [];
}

function addSubscriber(callback) {
  subscribers.push(callback);
}

instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(resolve => {
          addSubscriber(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(instance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        // Use environment variable for refresh token URL
        const { data } = await axios.get(
          import.meta.env.VITE_REFRESH_URL,
          { withCredentials: true }
        );

        const newAccessToken = data.accessToken;

        instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        onAccessTokenFetched(newAccessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        // Optional: Redirect or log out user
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;



import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // send cookies (like refreshToken)
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
        const { data } = await axios.get(
          "http://localhost:5000/api/auth/update-token", // adjust route if needed
          { withCredentials: true }
        );

        const newAccessToken = data.accessToken;

        // set new token for future requests
        instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        onAccessTokenFetched(newAccessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;


import axios from 'axios';

const setupAxiosInterceptors = () => {
  const isClient = typeof window !== 'undefined';
  const token = isClient ? localStorage.getItem('token') : null;

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default setupAxiosInterceptors;

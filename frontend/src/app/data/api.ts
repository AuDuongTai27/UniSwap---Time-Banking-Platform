const BASE_URL = 'http://localhost:5000';

// Lấy token từ localStorage
export const getToken = () => localStorage.getItem('token');

// Decode token lấy thông tin user hiện tại
export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload as { id: number; email: string; role: string };
  } catch {
    return null;
  }
};

// Helper fetch có Authorization header
export const apiFetch = (path: string, options: RequestInit = {}) => {
  const token = getToken();
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  }).then(res => res.json());
};
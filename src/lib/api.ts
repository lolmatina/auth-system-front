import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

// Add request interceptor to include Bearer token
api.interceptors.request.use((config) => {
  console.log('🚀 [AXIOS INTERCEPTOR] Request interceptor triggered for:', config.url);
  
  if (typeof window !== 'undefined') {
    console.log('🌐 [AXIOS INTERCEPTOR] Running in browser environment');
    
    // Extract token from cookie
    const cookies = document.cookie.split(';');
    console.log('🍪 [AXIOS INTERCEPTOR] All cookies:', cookies);
    
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    console.log('🎫 [AXIOS INTERCEPTOR] Token cookie found:', tokenCookie ? 'YES' : 'NO');
    
    let token = null;
    
    if (tokenCookie) {
      token = tokenCookie.split('=')[1];
      console.log('🔑 [AXIOS INTERCEPTOR] Token from cookie:', token ? token.substring(0, 20) + '...' : 'EMPTY');
    } else {
      console.log('❌ [AXIOS INTERCEPTOR] No token cookie found, trying localStorage...');
      token = localStorage.getItem('token');
      console.log('💾 [AXIOS INTERCEPTOR] Token from localStorage:', token ? token.substring(0, 20) + '...' : 'NOT FOUND');
    }
    
    if (token && token.trim() !== '') {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ [AXIOS INTERCEPTOR] Authorization header set from', tokenCookie ? 'cookie' : 'localStorage');
    } else {
      console.log('❌ [AXIOS INTERCEPTOR] No valid token found in cookie or localStorage');
    }
  } else {
    console.log('🖥️ [AXIOS INTERCEPTOR] Running in server environment - skipping token');
  }
  
  console.log('📤 [AXIOS INTERCEPTOR] Final headers:', config.headers);
  return config;
});



import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login as apiLogin, register as apiRegister } from '../services/api/auth';
import type { LoginData, RegisterData, User } from 'src/models/auth';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  async function login(credentials: LoginData) {
    const response = await apiLogin(credentials);
    const { token: newToken, user: newUser } = response.data;

    token.value = newToken;
    user.value = newUser;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));

    return response;
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async function register(data: RegisterData) {
    return await apiRegister(data);
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    register,
  };
});

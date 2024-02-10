import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { User, UserLoginData, UserRegisterData } from 'src/types/index';
import { AxiosResponse } from 'axios';

interface UserState {
  user: User;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    const userInLovaleStorage = localStorage.getItem('user');
    if (userInLovaleStorage) {
      return JSON.parse(userInLovaleStorage);
    }
    return { user: {} as User };
  },

  actions: {
    async login(userData: UserLoginData) {
      return api
        .post('/login', userData)
        .then((res: AxiosResponse<{ user: User; token: string }>) => {
          const userData = res.data.user;
          const token = res.data.token;
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', token);
          this.user = userData;
        })
        .catch((err) => {
          throw err;
        });
    },

    async register(userData: UserRegisterData) {
      return api
        .post('/register', userData)
        .then((res: AxiosResponse<{ user: User; token: string }>) => {
          const userData = res.data.user;
          const token = res.data.token;
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', token);
          this.user = userData;
        })
        .catch((err) => {
          throw err;
        });
    },

    async logout() {
      return api
        .post('/logout')
        .then(() => {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          this.user = {} as User;
        })
        .catch((err) => {
          throw err;
        });
    },
  },
});

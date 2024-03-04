import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { User, UserLoginData, UserRegisterData } from 'src/types/index';
import { AxiosResponse } from 'axios';
import { useRoomStore } from './room-store';

interface UserState {
  user: User;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => {
    const userInLovaleStorage = localStorage.getItem('user');
    if (userInLovaleStorage) {
      return {
        user: JSON.parse(userInLovaleStorage),
      };
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

    async searchUsers(query: string) {
      try {
        const response: AxiosResponse<{ users: User[] }> = await api.get(
          '/search/users',
          { params: { query } }
        );
        return response.data.users;
      } catch (err) {
        throw err;
      }
    },

    async updateUserName(name: string) {
      try {
        const response: AxiosResponse<{ user: User }> = await api.post(
          '/profile/username',
          { name }
        );
        localStorage.setItem('user', JSON.stringify(response.data.user));
        this.user = response.data.user;
        useRoomStore().rooms.forEach((room) => {
          const index = room.users.findIndex((user) => {
            user.id === this.user.id;
          });
          room.users[index] = this.user;
        });
      } catch (err) {
        throw err;
      }
    },
  },
});

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { boot } from 'quasar/wrappers';

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: false,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
  authEndpoint: process.env.VUE_APP_API_URL + '/broadcasting/auth',
});

export default boot(({ app }) => {
  app.config.globalProperties.$echo = echo;
});

export { echo };

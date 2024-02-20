<template>
  <q-layout>
    <div class="layout-view">
      <div
        class="col justify-between items-between shadow-2 text-grey-8"
        style="height: 100%; max-width: 200px"
        v-show="$q.screen.gt.xs"
      >
        <div style="height: 80%">
          <q-tabs
            vertical
            dense
            active-color="primary"
            indicator-color="primary"
            class="q-mt-lg"
          >
            <q-route-tab
              v-for="(link, index) in links"
              :key="index"
              :icon="link.icon"
              :to="link.link"
              :label="link.title"
              class="text-grey-9"
            />
            <q-tab
              class="text-grey-9"
              :label="userName ? 'Logout' : 'Login'"
              :icon="userName ? 'logout' : 'login'"
              caption="Login or Logout"
              @click="handleAction"
            />
          </q-tabs>
        </div>

        <div align="center" class="cursor-pointer">
          <q-avatar class="q-ma-md">
            <q-icon v-if="!user?.avatar_url" name="person" />
            <q-img class="round-avatar" v-else :src="url(user.avatar_url)" />
          </q-avatar>
        </div>
      </div>
      <!-- navigation for mobile -->

      <div v-show="!$q.screen.gt.xs">
        <q-footer elevated class="bg-grey-1">
          <q-tabs
            dense
            active-color="primary"
            indicator-color="primary"
            class=""
          >
            <q-route-tab
              v-for="(link, index) in links"
              :key="index"
              :icon="link.icon"
              :to="link.link"
              :label="link.title"
              class="text-grey-9"
            />
            <div align="center" class="cursor-pointer text-grey-9">
              <q-avatar class="q-ma-md">
                <q-icon v-if="!user?.avatar_url" name="person" />
                <q-img
                  class="round-avatar"
                  v-else
                  :src="url(user.avatar_url)"
                />
              </q-avatar>
            </div>
            <q-tab
              class="text-grey-9"
              :label="userName ? 'Logout' : 'Login'"
              :icon="userName ? 'logout' : 'login'"
              caption="Login or Logout"
              @click="handleAction"
            />
          </q-tabs>
        </q-footer>
      </div>
      <q-page-container class="main-content">
        <router-view />
      </q-page-container>
    </div>
  </q-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/user-store';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { url } from '../helpers/index';

const router = useRouter();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const userName = computed(() => user.value?.name);

const handleAction = async () => {
  if (userName.value !== undefined) {
    await userStore.logout();
    router.push('/guest/login');
  } else {
    router.push('/guest/login');
  }
};

const links = [
  {
    title: 'Chatrooms',
    caption: 'Create a chatroom',
    icon: 'people',
    link: '/rooms',
  },
];
</script>

<style scoped>
.layout-view {
  display: flex;
  height: 100vh;
}

.round-avatar {
  width: 100%;
  height: 100%;
}
</style>

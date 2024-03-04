<template>
  <q-dialog v-model="roomStore.showUpdateUserProfileDialog">
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Update Profile</div>
        <div>
          <q-uploader
            style="min-width: 100%"
            :factory="factoryFn"
            class="q-mt-md"
            v-model="user.avatar_url"
            flat
            outlined
            accept="image/*"
            color="primary"
            label="Select your avatar"
            :auto-upload="true"
          />
        </div>
        <q-input outlined v-model="user.name" label="Username" />
      </q-card-section>
      <q-card-actions>
        <q-btn
          flat
          label="Cancel"
          @click="roomStore.toggleUpdateUserProfileDialog()"
        />
        <q-btn label="Update" color="primary" @click="updateUserName" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoomStore } from '../stores/room-store';
import { useUserStore } from '../stores/user-store';
import { QUploaderFactoryFn, useQuasar } from 'quasar';
import { User } from 'src/types';
import { url } from '../helpers/index';
import { storeToRefs } from 'pinia';
const roomStore = useRoomStore();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const $q = useQuasar();
const imageUrl = ref<string | null>(null);
console.log(user.value);

const updateUserName = async () => {
  try {
    await userStore.updateUserName(user.value.name);
    roomStore.toggleUpdateUserProfileDialog();
    console.log(user);
  } catch (err) {
    // console.log(err);
    $q.notify({
      message: err.response.data.message,
      color: 'red',
      icon: 'person_remove',
    });
  }
};

const factoryFn: QUploaderFactoryFn = (files) => {
  return new Promise((resolve, reject) => {
    // Retrieve JWT token from your store.
    const token = localStorage.getItem('token');
    resolve({
      url: url('/api/profile/avatar'),
      method: 'POST',
      headers: [{ name: 'Authorization', value: `Bearer ${token}` }],
      fieldName: 'image',
    });
    reject((err) => console.log(err));
  });
};
</script>

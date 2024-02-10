<template>
  <q-page padding>
    <div class="row justify-center items-center" style="height: 100vh">
      <q-card class="my-card" style="width: 400px">
        <q-card-section class="text-center">
          <div class="text-h4 q-pb-md">Register</div>
          <div class="text-subtitle2">Join our amazing app</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="text-center">
          <q-form @submit.prevent="register()">
            <q-input
              class="q-pb-lg"
              outlined
              v-model="form.name"
              label="Name"
              :rules="[
                (val) => !!val || 'Field is required',
                (val) =>
                  val.length >= 4 ||
                  'Password must be at least 4 characters long',
              ]"
              lazy-rules
            />
            <q-input
              class="q-pb-lg"
              outlined
              v-model="form.email"
              label="Email"
              type="email"
              lazy-rules
              :rules="[
                (val) => !!val || 'Field is required',
                (val) => /.+@.+/.test(val) || 'Invalid email',
              ]"
            />
            <q-input
              class="q-pb-lg"
              outlined
              v-model="form.password"
              label="Password"
              type="Password"
              lazy-rules
              :rules="[
                (val) => !!val || 'Field is required',
                (val) =>
                  val.length >= 6 ||
                  'Password must be at least 6 characters long',
              ]"
            />
            <q-input
              outlined
              v-model="form.password_confirmation"
              label="Repeat Password"
              type="Password"
              lazy-rules
              :rules="[
                (val) => !!val || 'Field is required',
                (val) =>
                  form.password === form.password_confirmation ||
                  'The password field confirmation does not match.',
              ]"
            />
            <q-card-actions align="left" :vertical="true">
              <router-link
                to="/guest/login"
                class="q-pb-sm text-grey-10 text-subtitle1"
                >Already have an account?</router-link
              >
              <q-btn
                padding="8px 20px"
                type="submit"
                color="primary"
                label="Register"
              />
            </q-card-actions>
          </q-form>
        </q-card-section>

        <q-inner-loading
          :showing="visible"
          label="Please wait..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </q-card>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../stores/user-store';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
const userStore = useUserStore();
const router = useRouter();
const $q = useQuasar();
const form = ref<object>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});
const visible = ref<boolean>(false);

const register = async () => {
  try {
    visible.value = true;
    await userStore.register(form.value);
    visible.value = false;
    $q.notify({
      color: 'positive',
      message: 'Register success',
      position: 'top',
    });
    router.push('/');
  } catch (err) {
    visible.value = false;
    $q.notify({
      color: 'negative',
      message: err.response.data.message,
      position: 'top',
    });
  } finally {
    visible.value = false;
  }
};
</script>

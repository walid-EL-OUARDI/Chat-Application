<template>
  <q-dialog v-model="roomStore.showAddRoomDialog">
    <q-card>
      <q-card-section>
        <q-stepper v-model="step" ref="stepper" color="primary" animated>
          <q-step
            name="step1"
            title="Create A Room"
            icon="add"
            :done="step1done"
            done-color="green"
            active-color="red"
          >
            <q-input v-model="roomName" label="Room Name" class="q-my-md" />

            <q-btn color="primary" label="Create Room" @click="createRoom" />
          </q-step>
          <q-step
            name="step2"
            title="Add Users"
            icon="add"
            :done="step2done"
            done-color="green"
            active-color="red"
          >
            <q-select
              use-input
              multiple
              use-chips
              v-model="selectedUsers"
              :options="users"
              option-label="name"
              option-value="id"
              @filter="filterFn"
              class="q-my-dm"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section side>
                    <q-avatar>
                      <q-icon name="person" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.email }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-card-actions>
              <q-btn label="Cancel" @click="roomStore.toggleAddRoomDialog()" />
              <q-btn
                color="primary"
                label="Add Users"
                @click="addUsersToChatroom"
              />
            </q-card-actions>
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoomStore } from '../stores/room-store';
import { useUserStore } from '../stores/user-store';
import { useQuasar } from 'quasar';
import { User } from 'src/types';
const $q = useQuasar();
const roomStore = useRoomStore();
const userStore = useUserStore();
const roomName = ref('');
const newlyCreatedRoom = ref();
const step = ref('step1');

const step1done = ref(false);
const step2done = ref(false);
const selectedUsers = ref<User[]>([]);
const users = ref<User[]>([]);

const filterFn = (
  val: string,
  update: (cb: () => void) => void,
  abort: () => void
) => {
  update(() => {
    if (val.length <= 2) {
      users.value = [];
      abort();
      return;
    }
    userStore.searchUsers(val).then((res) => {
      users.value = res;
    });
  });
};

const createRoom = async () => {
  try {
    const response = await roomStore.createRoom(roomName.value);
    newlyCreatedRoom.value = response.chatroom;
    step1done.value = true;
    step.value = 'step2';
    $q.notify({
      message: 'Room created',
      color: 'positive',
    });
  } catch (err: any) {
    console.log(err.response);

    $q.notify({
      message: err.response.data.message,
      color: 'negative',
    });
  }
};

const addUsersToChatroom = async () => {
  try {
    await roomStore.addUsersToChatroom(
      selectedUsers.value.map((user) => user.id),
      newlyCreatedRoom.value.id
    );
    const isMultipleUsers = selectedUsers.value.length > 1;
    $q.notify({
      message: isMultipleUsers ? 'Users added to room' : 'User added to room',
      color: 'positive',
    });
    selectedUsers.value = [];
    newlyCreatedRoom.value = null;
    step1done.value = false;
    step2done.value = false;
    step.value = 'step1';
    roomName.value = '';
    roomStore.toggleAddRoomDialog();
  } catch (err: any) {
    $q.notify({
      message: err.response.data.message,
      color: 'negative',
    });
  }
};
</script>

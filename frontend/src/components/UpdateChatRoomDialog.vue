<template>
  <q-dialog v-model="roomStore.showUpdateRoomDialog" v-if="roomToUpdate">
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6 text-dark">Update Room{{ roomToUpdate.id }}</div>
        <q-input
          v-model="roomToUpdate.name"
          label="Room Name"
          outlined
          class="q-my-md"
        />
        <q-select
          use-input
          multiple
          use-chips
          v-model="roomToUpdate.users"
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
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-card-actions>
          <q-btn label="Cancel" @click="roomStore.toggleUpdateRoomDialog()" />
          <q-btn color="primary" label="Update Room" @click="updateRoom()" />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { User } from '../types/index';
import { useRoomStore } from '../stores/room-store';
import { useUserStore } from '../stores/user-store';
const userStore = useUserStore();
const roomStore = useRoomStore();
const $q = useQuasar();
import { computed, ref } from 'vue';
const users = ref<User[]>([]);

const props = defineProps<{
  roomToUpdateId: number;
}>();

const { rooms } = storeToRefs(roomStore);
const roomToUpdate = computed(() =>
  rooms.value.find((room) => room.id === props.roomToUpdateId)
);

// const roomToUpdate = storeToRefs(roomStore).rooms.value.find(
//   (room) => room.id === props.roomToUpdateId
// );
console.log(roomToUpdate);

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

const updateRoom = async () => {
  if (roomToUpdate.value !== undefined) {
    try {
      await roomStore.updateChatroom(roomToUpdate.value);
      roomStore.toggleUpdateRoomDialog();
      $q.notify({
        message: 'Room Updated',
        type: 'positive',
      });
    } catch (err: any) {
      $q.notify({
        message: err.response.data.message,
        type: 'negative',
      });
    }
  }
};
</script>

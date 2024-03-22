<template>
  <div style="height: 100vh; width: 100%">
    <AddChatRoomDialog />
    <UpdateChatRoomDialog
      v-if="roomToUpdateId"
      :roomToUpdateId="roomToUpdateId"
    />
    <div class="row" style="height: 100%; width: 100%">
      <div>
        <div class="text-h4 text-greay-9 q-my-md q-mx-md">
          Chat Rooms
          <q-btn
            flat
            dense
            label="Add Chatroom"
            color="primary"
            icon-right="add"
            class="q-my-sm q-mx-md"
            @click="roomStore.toggleAddRoomDialog"
          />
        </div>
        <q-scroll-area style="height: 80%">
          <q-list padding>
            <q-item
              v-for="(room, index) in rooms"
              :key="index"
              class="q-my-sm q-my-lg"
              clickable
              v-ripple
            >
              <q-menu transition-show="scale" transition-hide="scale">
                <q-item clickable>
                  <q-item-section @click="goToRoom(room.id)"
                    >Go to room</q-item-section
                  >
                </q-item>
                <q-item clickable @click="toggleUpdateRoomDialog(room.id)">
                  <q-item-section>Update Room</q-item-section>
                </q-item>
                <q-item clickable @click="deleteRoom(room.id)">
                  <q-item-section>Delete Room</q-item-section>
                </q-item>
              </q-menu>
              <div
                class="text-subtitle2 row justify-center"
                :style="{
                  width: '120px',
                  position: 'relative',
                  height: '100%',
                }"
              >
                <q-avatar
                  v-for="(user, index) in room.users"
                  :key="index"
                  size="50px"
                  class="overlapping"
                  :style="`left: ${index * 25}px`"
                >
                  <q-img
                    class="round-avatar"
                    :src="
                      user.avatar_url
                        ? url(user.avatar_url)
                        : '/images/default-avatar.jpg'
                    "
                  />
                </q-avatar>
              </div>
              <q-item-section class="q-ml-md">
                <q-item-label
                  class="text-grey-9 row items-center text-weight-bold"
                  >Room Name :
                  <div class="text-body2 q-ml-xs">{{ room.name }}</div>
                </q-item-label>
                <q-item-label v-if="room.last_message?.content"
                  class="text-grey-9 row items-center text-weight-bold"
                  >Last Message :
                  <div class="text-body2 q-ml-xs">
                    {{ room.last_message.content }}
                  </div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </div>
      <div class="chat-window">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useRoomStore } from '../stores/room-store';
import AddChatRoomDialog from './AddChatRoomDialog.vue';
import UpdateChatRoomDialog from './UpdateChatRoomDialog.vue';
import { storeToRefs } from 'pinia';
const roomStore = useRoomStore();
import { useQuasar } from 'quasar';
import { url } from 'src/helpers';
const $q = useQuasar();
const router = useRouter();

const roomToUpdateId = ref<number>();

onBeforeMount(async () => {
  await roomStore.getRooms();
  console.log(rooms.value);
});

const { rooms } = storeToRefs(roomStore);

const toggleUpdateRoomDialog = async (roomId: number) => {
  // roomToUpdateId.value = 0;
  roomToUpdateId.value = roomId;
  console.log(roomToUpdateId.value);

  roomStore.toggleUpdateRoomDialog();
};

const goToRoom = async (roomId: number) => {
  router.push(`/rooms/${roomId}/messages`);
};

const deleteRoom = async (roomId: number) => {
  try {
    await roomStore.deleteRoom(roomId);
    $q.notify({
      message: 'Chatroom deleted successfully',
      color: 'positive',
    });
  } catch (err: any) {
    $q.notify({
      message: err.response.data.message,
      color: 'negative',
    });
  }
};
</script>

<style scoped>
.overlapping {
  border: 2px solid white;
  position: absolute;
}

.chat-window {
  flex-grow: 1;
}

.round-avatar {
  width: 100%;
  height: 100%;
}
</style>

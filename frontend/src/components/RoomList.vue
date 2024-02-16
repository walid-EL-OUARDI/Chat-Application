<template>
  <div style="height: 100vh">
    <AddChatRoomDialog />
    <div class="row" style="height: 100%">
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
              v-for="n in 6"
              :key="n"
              class="q-my-sm q-my-lg"
              clickable
              v-ripple
            >
              <div
                class="text-subtitle2 row justify-center"
                :style="{
                  width: '120px',
                  position: 'relative',
                  height: '100%',
                }"
              >
                <q-avatar
                  v-for="n in 3"
                  :key="n"
                  color="primary"
                  size="50px"
                  text-color="white"
                  class="overlapping"
                  :style="`left: ${n * 25}px`"
                >
                  <img v-if="image" :src="image" />
                  <q-icon v-else name="person" />
                </q-avatar>
              </div>
              <q-item-section class="q-ml-md">
                <q-item-label
                  class="text-grey-9 row items-center text-weight-bold"
                  >Room Name :
                  <div class="text-body2 q-ml-xs">room name</div>
                </q-item-label>
                <q-item-label class="text-grey-8">
                  No messages yet
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </div>
      <!-- <div>
      <router-view />
    </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoomStore } from '../stores/room-store';
import AddChatRoomDialog from './AddChatRoomDialog.vue';
const roomStore = useRoomStore();
</script>

<style scoped>
.overlapping {
  border: 2px solid white;
  position: absolute;
}
</style>

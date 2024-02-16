<template>
  <q-dialog v-model="roomStore.showAddRoomDialog">
    <q-card>
      <q-card-section>
        <q-stepper v-model="step" ref="stepper" color="primary" animated>
          <q-step
            :name="1"
            title="Create A Room"
            icon="add"
            :done="step > 1"
            done-color="green"
            active-color="red"
          >
            <q-input label="Room Name" class="q-my-md" />

            <q-btn color="primary" label="Create Room" />
          </q-step>
          <q-step
            :name="2"
            title="Add Users"
            icon="add"
            :done="step > 1"
            done-color="green"
            active-color="red"
          >
            <q-input label="Room Name" class="q-my-md" />

            <q-btn color="White" label="Cancel" />
            <q-btn color="primary" label="Add Users" />
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoomStore } from '../stores/room-store';
const roomStore = useRoomStore();
const step = ref(1);
</script>

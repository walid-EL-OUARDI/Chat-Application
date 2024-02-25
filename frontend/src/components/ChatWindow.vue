<template>
  <div class="chat-window" v-if="room">
    <div class="header">
      <h6 class="room-name">
        Chat With :
        {{ room?.users.map((user) => user.name).join(',') }}
      </h6>

      <div
        :style="{
          width: '120px',
          position: 'relative',
          height: '100%',
        }"
        class="flex-center row q-mb-lg"
      >
        <q-avatar
          v-for="(user, index) in room.users"
          :key="user.id"
          size="50px"
          :style="`left: ${index * 25}px`"
          color="primary"
          text-color="white"
          class="q-mr-sm overlapping"
        >
          <!-- <q-img
            class="round-avatar"
            v-if="user.avatar_url"
            :src="url(user.avatar_url)"
          /> -->
          <q-icon name="person" />
        </q-avatar>
      </div>
    </div>

    <q-scroll-area
      style="height: 60vh; width: 100%"
      class="q-px-md"
      ref="messageContainer"
    >
      <transition-group
        appear
        enter-active-class="animated fadeInLeft"
        leave-active-class="animated fadeOut"
      >
        <q-chat-message
          v-for="message in room.messages"
          :key="message.id"
          avatar="
            https://cdn.quasar.dev/img/avatar1.jpg
          "
          :name="message.sender?.name"
          :sent="message.sender?.id === user.id"
          :bg-color="message.sender?.name === user.name ? 'primary' : 'grey-4'"
          :text-color="message.sender?.name === user.name ? 'white' : 'black'"
          :stamp="message.created_at"
        >
          <div>
            <div class="">
              {{ message.content }}
            </div>
            <q-img
              v-if="message.image_url"
              :src="url(message.image_url)"
              class="chat-image"
            /></div
        ></q-chat-message>
      </transition-group>
    </q-scroll-area>

    <div class="message-input">
      <div class="row item-center">
        <div class="col-8">
          <q-input
            @keyup="onKeyup"
            @keyup.enter="sendMessage"
            v-model="messageText"
            dense
            outlined
            class="message-field"
            placeholder="Type a message"
          />
        </div>

        <div class="col-4">
          <input
            class="q-mx-md"
            type="file"
            accept="image/*"
            ref="imageUploader"
            style="display: none"
            @change="handleImageUpload"
          />
          <q-btn
            class="q-mx-md"
            round
            dense
            color="primary"
            icon="image"
            @click="triggerImageUpload"
          />
          <q-btn
            class="q-mx-md"
            @click="sendMessage"
            round
            dense
            color="primary"
            icon="send"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { QScrollArea, useQuasar } from 'quasar';
import { url } from 'src/helpers';
import { echo } from 'src/boot/echo';
import { useRoomStore } from 'src/stores/room-store';
import { useUserStore } from 'src/stores/user-store';
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { User } from 'src/types';
const router = useRouter();
const roomStore = useRoomStore();
const userStore = useUserStore();
const $q = useQuasar();
const { room } = storeToRefs(roomStore);
const { user } = storeToRefs(userStore);

const imageUploader = ref<HTMLInputElement>();
const selectedImage = ref<File>();
const messageText = ref<string>('');
const messageContainer = ref<QScrollArea | null>(null);

const chatroomId = computed<number>(() =>
  Number(router.currentRoute.value.params.roomId)
);

onBeforeMount(async () => {
  await roomStore.getRoomById(chatroomId.value);
  setUpListners(chatroomId.value);
  scrollToBottom();
  // console.log(chatroomId.value);
});
// console.log(chatroomId.value);

watch(chatroomId, async () => {
  await roomStore.getRoomById(chatroomId.value);
  scrollToBottom();
});
const triggerImageUpload = () => {
  imageUploader.value?.click();
  // console.log(imageUploader);
};

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  selectedImage.value = file;
  //   console.log(event);
};

const sendMessage = async () => {
  if (!messageText.value && !selectedImage.value) return;
  const newFormData = new FormData();
  newFormData.append('content', messageText.value);
  newFormData.append('image', selectedImage.value || '');
  try {
    await roomStore.sendMessage(newFormData, chatroomId.value);
    messageText.value = '';
    if (imageUploader.value) {
      imageUploader.value.value = '';
    }
    selectedImage.value = undefined;
    scrollToBottom();
  } catch (error) {
    $q.notify({
      message: 'Error sending message',
      color: 'red',
      icon: 'error',
    });
  }
};

const setUpListners = (roomId: string | number) => {
  echo
    .join(`chatroom.${roomId}`)
    .here((users: User[]) => {
      console.log(users);
    })
    .joining((user: User) => {
      console.log(user.name);
    })
    .leaving((user: User) => {
      console.log(user.name);
    })
    .listen('MessageSent', (e) => {
      console.log(e);
      roomStore.addMessage(e.message, chatroomId.value);
      scrollToBottom;
    })
    .error((error) => {
      console.error(error);
    });
};

const scrollToBottom = () => {
  if (!messageContainer.value) {
    return;
  }
  const scrollTarget = messageContainer.value.getScrollTarget();
  const scrollHeight = scrollTarget.scrollHeight;
  messageContainer.value?.setScrollPosition('vertical', scrollHeight);
  // console.log(messageContainer.value.getScrollTarget().scrollHeight);
};
</script>

<style scoped>
.header {
  padding: 0.5rem 0;
  text-align: center;
  color: #1d2129;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.room-name {
  font-size: 1.2rem;
  font-weight: bold;
}

.chat-window {
  border-left: 1px solid #e0e0e0;
  height: 100%;
}

.overlapping {
  border: 2px solid white;
  position: absolute;
}
</style>

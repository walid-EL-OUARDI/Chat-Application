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

        <!-- typing indicator -->
        <div v-if="usersTyping.length > 0">
          <q-chat-message
            :bg-color="true ? 'grey-4' : ''"
            v-for="(user, index) in usersTyping"
            :key="index"
          >
            <template v-slot:name>{{ (user[0], user[1]) }}</template>
            <template v-slot:avatar>
              <img
                v-if="user[1]"
                class="q-message-avatar q-message-avatar--received"
                :src="user[1]"
              />
              <q-avatar
                v-else
                size="50px"
                :color="true ? 'grey-4' : ''"
                text-color="black"
                class="q-mr-sm"
              >
                <q-icon name="person" />
              </q-avatar>
            </template>

            <q-spinner-dots size="2rem" />
          </q-chat-message>
        </div>
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
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Message, User } from 'src/types';
import { api } from 'src/boot/axios';
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
const isTyping = ref<boolean>(false);
const usersTyping = ref<string[][]>([]);
let typingTimeout: ReturnType<typeof setTimeout> | null = null;

const chatroomId = computed<number>(() =>
  Number(router.currentRoute.value.params.roomId)
);

onMounted(async () => {
  await roomStore.getRoomById(chatroomId.value);
  setUpListeners(chatroomId.value);
  scrollToBottom();
  // console.log(chatroomId.value);
});

onUnmounted(() => {
  echo.leave(`chatroom.${chatroomId.value}`);
});
// console.log(chatroomId.value);

watch(chatroomId, async (oldRoomId, newRoomId) => {
  if (oldRoomId !== newRoomId) {
    echo.leave(`chatroom.${oldRoomId}`);
    setUpListeners(Number(newRoomId));
    await roomStore.getRoomById(chatroomId.value);
    scrollToBottom();
  }
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

const setUpListeners = (roomId: string | number) => {
  echo
    .join(`chatroom.${roomId}`)
    .here((users: User[]) => {
      console.log(users);
    })
    .joining((user: User) => {
      $q.notify({
        message: `${user.name} has joined the room`,
        color: 'green',
        icon: 'person_add',
      });
    })
    .leaving((user: User) => {
      $q.notify({
        message: `${user.name} has left the room`,
        color: 'red',
        icon: 'person_remove',
      });
    })
    .listen('MessageSent', (e: { message: Message }) => {
      // console.log(e);
      roomStore.addMessage(e.message, chatroomId.value);
      scrollToBottom();
    })
    .error((error) => {
      console.error(error);
    });

  echo
    .private(`chatroom.${roomId}`)
    .listen(
      'UserIsTyping',
      (e: { userName: string; userAvatarUrl: string; roomId: number }) => {
        const index = usersTyping.value.findIndex(
          (user) => user[0] === e.userName
        );
        if (index === -1) {
          usersTyping.value.push([e.userName, e.userAvatarUrl]);
          scrollToBottom();
          console.log(usersTyping.value);
        }
      }
    );

  echo
    .private(`chatroom.${roomId}`)
    .listen(
      'UserStoppedTyping',
      (e: { userName: string; userAvatarUrl: string; roomId: number }) => {
        console.log(usersTyping.value);
        const index = usersTyping.value.findIndex(
          (user) => user[0] === e.userName
        );
        console.log(index);

        // scrollToBottom();
        if (index > -1) {
          usersTyping.value.splice(index, 1);
          console.log(usersTyping.value);
        }
      }
    );
};

const onKeyup = () => {
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }
  typingTimeout = setTimeout(() => {
    emitUserStoppedTyping();
    console.log('user stopped typing');
  }, 2000);

  if (!isTyping.value) {
    emitUserIsTyping();
    console.log('user is typing');
  }
};

const emitUserIsTyping = async () => {
  isTyping.value = true;
  await api.post('/chatrooms/' + chatroomId.value + '/user-is-typing');
};

const emitUserStoppedTyping = async () => {
  isTyping.value = false;
  await api.post('/chatrooms/' + chatroomId.value + '/user-stopped-typing');
};

const scrollToBottom = () => {
  console.log(messageContainer.value?.getScrollTarget());
  if (!messageContainer.value) {
    return;
  }
  const scrollTarget = messageContainer.value.getScrollTarget();
  const scrollHeight = scrollTarget.scrollHeight;
  messageContainer.value.setScrollPosition('vertical', scrollHeight);
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

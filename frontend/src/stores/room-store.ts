import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { ChatRoom, Message } from 'src/types/index';
import { AxiosResponse } from 'axios';

interface RoomState {
  rooms: ChatRoom[];
  room: ChatRoom | null;
  showUpdateRoomDialog: boolean;
  showAddRoomDialog: boolean;
}

export const useRoomStore = defineStore('room', {
  state: (): RoomState => {
    return {
      rooms: [],
      room: null,
      showUpdateRoomDialog: false,
      showAddRoomDialog: false,
    };
  },

  actions: {
    toggleAddRoomDialog() {
      this.showAddRoomDialog = !this.showAddRoomDialog;
      console.log(this.showAddRoomDialog);
    },
    toggleUpdateRoomDialog() {
      this.showUpdateRoomDialog = !this.showUpdateRoomDialog;
    },
    async createRoom(roomName: string) {
      try {
        const response: AxiosResponse<{ chatroom: ChatRoom }> = await api.post(
          '/chatrooms',
          { room_name: roomName }
        );
        this.rooms.push(response.data.chatroom);
        return response.data;
      } catch (err) {
        throw err;
      }
    },
    async getRooms() {
      try {
        const response: AxiosResponse<{ chatroom: ChatRoom[] }> = await api.get(
          '/chatrooms'
        );
        this.rooms = response.data.chatroom;
        return response.data;
      } catch (err) {
        throw err;
      }
    },
    async getMessagesOfRoom(roomId: number) {
      try {
        const response: AxiosResponse<{ messages: Message[] }> = await api.get(
          `/chatrooms/${roomId}/messages`
        );
        // lets get the chatroomIndex from the rooms array
        const chatroomIndex = this.rooms.findIndex(
          (room) => room.id === roomId
        );
        this.rooms[chatroomIndex].messages = response.data.messages;
      } catch (err) {
        throw err;
      }
    },
    async sendMessage(messageData: FormData, roomId: number) {
      try {
        const response = await api.post(
          '/chatrooms/' + roomId + '/messages',
          messageData
        );

        const chatroomIndex = this.rooms.findIndex(
          (room) => room.id === roomId
        );
        this.rooms[chatroomIndex].last_message = response.data.message;
        if (this.room?.messages) {
          this.room.messages.push(response.data.message);
        }
      } catch (err) {
        throw err;
      }
    },
    async deleteRoom(roomId: number) {
      try {
        await api.delete('/chatrooms/' + roomId);
        const index = this.rooms.findIndex((room) => room.id === roomId);
        this.rooms.splice(index, 1);
        if (this.room?.id === roomId) this.room = null;
      } catch (err) {
        throw err;
      }
    },
  },
});

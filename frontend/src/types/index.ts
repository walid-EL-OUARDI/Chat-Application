export interface User {
  id: number;
  name: String;
  avatar_url: String;
  email: String;
}
export interface UserLoginData {
  email: String;
  password: String;
}
export interface UserRegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface Message {
  id: number;
  sender: User;
  content: string;
  created_at: string;
  image_url?: string;
}

export interface ChatRoom {
  id: number;
  users: User[];
  name: string;
  last_message: Message;
  messages?: Message[];
}

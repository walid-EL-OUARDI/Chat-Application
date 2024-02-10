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

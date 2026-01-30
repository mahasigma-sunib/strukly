import type UserType from "./UserType";

export interface UserAuthType {
  user: UserType | null;
  authChecked: boolean;

  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  isAuth: () => boolean;
  changeUsername: (name: string) => Promise<void>;
  changePassword: (previousPassword: string, newPassword: string) => Promise<void>;
}

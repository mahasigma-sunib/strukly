import type UserType from "./UserType";

export interface UserAuthType {
  user: UserType | null;

  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  isAuth: () => boolean;
}

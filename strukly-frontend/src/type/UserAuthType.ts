export interface UserAuthType {
    login: (email: string, password: string) => Promise<void>
    logout: () => void;
    userId: string | null;
    userName: string | null;
    email: string | null;
    token: string | null;
    isAuth: () => boolean;
}
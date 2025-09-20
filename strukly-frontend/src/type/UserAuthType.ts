export interface UserAuthType {
    register: (username: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    userId: string | null;
    userName: string | null;
    userEmail: string | null;
    token: string | null;
    isAuth: () => boolean;
}
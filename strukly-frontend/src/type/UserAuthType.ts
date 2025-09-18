export interface UserAuthType {
    login: (email: string, password: string) => Promise<void>
    logout: () => void;
    // userId: string;
    // username: string;
    token: string |  null;
    isAuth: boolean;
}
import axios from "axios";
import { create } from "zustand";
import type { UserAuthType } from "../type/UserAuthType";

const useUserAuth = create<UserAuthType>((set, get) => ({
  //initial value of the user
  user: null,
  authChecked: false,

  register: async (name, email, password) => {
    try {
      //create user infomation in db
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
      });
    } catch (error: any) {
      //error handling
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          throw new Error("Email or username already exist");
        }
        throw new Error(error.response?.data?.message || "registration failed");
      }
      throw error;
    }
  },

  login: async (userEmail, password) => {
    // Fetching and storing token
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
      {
        email: userEmail,
        password,
      },
      { withCredentials: true },
    );
  },

  fetchProfile: async () => {
    try {
      const userRes = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
        {
          withCredentials: true,
        },
      );
      const { user } = userRes.data;
      // console.log(user);
      set({ user });
    } catch (error) {
      set({ user: null }); // Not authenticated
    } finally {
      set({ authChecked: true });
    }
  },

  //use for protectedRoute
  isAuth: () => !!get().user, // double negation return the boolean value

  //remove all the user data information
  logout: async () => {
    set({ user: null });
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/logout`,
      {},
      { withCredentials: true },
    );
  },

  changeUsername: async (name) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
        { name },
        { withCredentials: true },
      );
      set((state) => ({
        user: state.user ? { ...state.user, name } : null,
      }));
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (previousPassword, newPassword) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
        { previousPassword, newPassword },
        { withCredentials: true },
      );
    } catch (error) {
      throw error;
    }
  },
}));

export default useUserAuth;

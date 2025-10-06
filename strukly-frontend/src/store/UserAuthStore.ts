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
      await axios.post("http://localhost:3000/api/auth/register", {
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
      "http://localhost:3000/api/auth/login",
      {
        email: userEmail,
        password,
      },
      { withCredentials: true }
    );
  },

  fetchProfile: async () => {
    try {
      const userRes = await axios.get(
        "http://localhost:3000/api/auth/profile",
        {
          withCredentials: true,
        }
      );
      const { user } = userRes.data;
      console.log(user);
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
      "http://localhost:3000/api/auth/logout",
      {},
      { withCredentials: true }
    );
  },
}));

export default useUserAuth;

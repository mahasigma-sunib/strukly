import axios from "axios";
import { create } from "zustand";
import type { UserAuthType } from "../type/UserAuthType";

const useUserAuth = create<UserAuthType>((set, get) => ({
  //initial value of the user
  token: null,
  userId: "",
  userName: "",
  userEmail: "",

  register: async (name, email, password) => {
    try {   //create user infomation in db
      await axios.post("http://localhost:3000/api/auth/register", {
        name,
        email,
        password,
      });
    } catch (error: any) {  //error handling
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
    const res = await axios.post("http://localhost:3000/api/auth/login", { email: userEmail, password });
    const token = res.data.token;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Fetch user info
    const userRes = await axios.get("http://localhost:3000/api/auth/profile");
    const { id, name, email } = userRes.data.user;
    set({
      token: token,
      userId: id,
      userName: name,
      userEmail: email,
    });
  },

  //use for protectedRoute
  isAuth: () => !!get().token, // double negation return the boolean value

  //remove all the user data information
  logout: () => {
    set({ token: null, userId: null, userEmail: null });
    delete axios.defaults.headers.common["Authorization"];
  },
}));

export default useUserAuth;

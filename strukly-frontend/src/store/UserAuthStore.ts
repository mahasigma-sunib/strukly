import { create } from "zustand";
import type { UserAuthType } from "../type/UserAuthType";
import axios from "axios";

const useUserAuth = create<UserAuthType>((set, get) => ({
  token: null,
  userId: "",
  userName: "",
  email: "",

  register: async (name, email, password) => {
    try {
      await axios.post("http://localhost:3000/api/auth/register", {
        name,
        email,
        password,
      });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          throw new Error("Email or username already exist");
        }
        throw new Error(error.response?.data?.message || "registration failed");
      }
      throw error;
    }
  },

  login: async (email, password) => {
    // Fetching and storing token
    const res = await axios.post("http://localhost:3000/api/auth/login", { email, password });
    const token = res.data.token;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Fetch user info
    const userRes = await axios.get("http://localhost:3000/api/auth/profile");
    const { id, name, email: userEmail } = userRes.data.user;
    set({
      token: token,
      userId: id,
      userName: name,
      email: userEmail,
    });

    // Simulate backend response
    // await new Promise((resolve) => setTimeout(resolve, 300));
    // const fakeToken = "fake-jwt-token";
    // const fakeUserId = "123";
    // const fakeUserName = "nig";
    // const fakeEmail = email;
    // set({
    //   token: fakeToken,
    //   userId: fakeUserId,
    //   userName: fakeUserName,
    //   email: fakeEmail,
    // });
  },

  //use for protectedRoute
  isAuth: () => !!get().token, // double negation return the boolean value

  logout: () => {
    set({ token: null, userId: null, email: null });
    delete axios.defaults.headers.common["Authorization"];
  },
}));

export default useUserAuth;

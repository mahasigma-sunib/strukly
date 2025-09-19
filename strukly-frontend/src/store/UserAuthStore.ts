import { create } from "zustand";
import type { UserAuthType } from "../type/UserAuthType";
import axios from "axios";

const useUserAuth = create<UserAuthType>((set, get) => ({
  token: null,
  userId: "",
  userName: "",
  email: "",

  register: async (username, email, password) => {
     await axios.post("http://localhost:3000/api/auth/register", {username, email, password});
  },

  login: async (email, password) => {
    // Fetching and storing token
    const res = await axios.post("/api/auth/login", { email, password });
    const token = res.data.token;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Fetch user info
    const userRes = await axios.get("/api/auth/profile");
    const { id, username: userName, email: userEmail } = userRes.data;
    set({
      token: token,
      userId: id,
      userName: userName,
      email: userEmail,
      // isAuth: true,
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

import { create } from "zustand";
import type { UserAuthType } from "../type/UserAuthType";
import axios from "axios";

const useUserAuth = create<UserAuthType>((set) => ({
  token: null,
  userId: "",
  email: "",
  isAuth: false,
  login: async ({/*email, password */}) => {
    //Fetching and storing token
    // const res = await axios.post("", { email, password });
    // const token = res.data.token;
    // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    //Fetch user info
    // const userRes = await axios.get("");
    // const { id, email: userEmail } = userRes.data;
    // set({
    //   token: token,
    //   userId: id,
    //   email: userEmail,
    //   isAuth: true,
    // });

    // Simulate backend response
    await new Promise((resolve) => setTimeout(resolve, 500));
    const fakeToken = "fake-jwt-token";
    const fakeUserId = "123";
    const fakeEmail = email;
    set({
      token: fakeToken,
      userId: fakeUserId,
      email: fakeEmail,
      isAuth: true,
    });
  },
  logout: () => {
    set({ token: null, userId: null, email: null, isAuth: false });
    delete axios.defaults.headers.common["Authorization"];
  },
}));

export default useUserAuth;

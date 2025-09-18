import { create } from "zustand";
import type { UserAuthType } from "../type/UserAuthType";
import axios from "axios";

const useUserAuth = create<UserAuthType>((set) => ({
  token : null,
  // userId : "",
  // username : "",
  isAuth: false,
  login: async (email, password) => {
    const res = await axios.post("", { email, password});
    const token = res.data.token;

    set({ token: token });
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },
  logout: () => {
    set({ token: null})
    delete axios.defaults.headers.common["Authorization"];
  }
}));

export default useUserAuth;

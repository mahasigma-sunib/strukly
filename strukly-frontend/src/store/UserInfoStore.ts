import { create } from "zustand";
import type { UserInfoType } from "../type/UserInfoType";
import axios from "axios";

type userInfoStore = {
  userInfo: UserInfoType | null;
  setUserInfo: (info: UserInfoType) => void
  fetchUserInfo: () => Promise<void>;
};

const useUserInfo = create<userInfoStore>((set) => ({
  userInfo: null,
  setUserInfo: (info) => set({ userInfo: info }),
  fetchUserInfo: async () => {
    try {
      const res = await axios.get("");
      set({ userInfo: res.data });
    } catch (e) {
      set({ userInfo: null });
    }
  },
}));

export default useUserInfo;

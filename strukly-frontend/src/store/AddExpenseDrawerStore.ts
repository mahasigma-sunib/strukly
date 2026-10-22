import { create } from "zustand";

type State = {
  isOpen: boolean;
};

type Actions = {
  open: () => void;
  close: () => void;
};

const useAddExpenseDrawer = create<State & Actions>()((set) => ({
  isOpen: false,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export default useAddExpenseDrawer;

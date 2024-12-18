import { create } from 'zustand';

type StoreState = {
  userId: string;
  removeUserId: () => void;
  updateUserId: (newUserId: string) => void;
};

const store = create<StoreState>((set) => ({
  userId: "",
  removeUserId: () => set({ userId: "" }),
  updateUserId: (newUserId: string) => set({ userId: newUserId }),
}));

export const useStore = store;

export default store;

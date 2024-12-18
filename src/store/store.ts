import { create } from 'zustand';

type StoreState = {
  userId: string;
  removeUserId: () => void;
  updateUserId: (newUserId: string) => void;
  getUserId: () => string;
};

const store = create<StoreState>((set) => ({
  userId: "",
  removeUserId: () => set({ userId: "" }),
  updateUserId: (newUserId: string) => set({ userId: newUserId }),
  getUserId: (): string => store.getState().userId,
}));

export const useStore = store;

export default store;

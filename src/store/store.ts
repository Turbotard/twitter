import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

type StoreState = {
  userId: string;
  removeUserId: () => void;
  updateUserId: (newUserId: string) => void;
};

const store = create<StoreState>()(
  persist(
    (set) => ({
      userId: "",
      removeUserId: () => set({ userId: "" }),
      updateUserId: (newUserId: string) => set({ userId: newUserId }),
    }),
    {
      name: 'user-storage',
    } as PersistOptions<StoreState>
  )
);

export const useStore = store;

export default store;

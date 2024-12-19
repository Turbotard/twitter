import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

type StoreState = {
  userId: string;
  removeUserId: () => void;
  updateUserId: (newUserId: string) => void;
};
type UserState = {
  username: string;
  removeUsernameId: () => void;
  updateUsernameId: (newUsernameId: string) => void;
};
const store = create<StoreState>()(
  persist(
    (set) => ({
      userId: "",
      removeUserId: () => set({ userId: "" }),
      updateUserId: (newUserId: string) => set({ userId: newUserId }),
    }),
    {
      name: 'userId-storage',
    } as PersistOptions<StoreState, Partial<StoreState>>
  )
);

const usernameStore = create<UserState>()(
  persist(
    (set) => ({
      username: "",
      removeUsernameId: () => set({ username: "" }),
      updateUsernameId: (newUsernameId: string) => set({ username: newUsernameId }),
    }),
    {
      name: 'user-storage',
    } as PersistOptions<UserState, Partial<UserState>>
  )
);

export const useStore = store;
export const useUsernameStore = usernameStore;

export default store;

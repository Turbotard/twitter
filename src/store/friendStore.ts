import { Key } from 'react';
import { create } from 'zustand';

type Friend = {
  userId: Key | null | undefined;
  id: string;
  username: string;
};

type FriendStoreState = {
  friends: Friend[];
  friendId: string;
  friendName: string;
  setFriends: (newFriends: Friend[]) => void;
  updateFriendId: (newFriendId: string) => void;
  updateFriendName: (newFriendName: string) => void;
  removeFriendId: () => void;
  removeFriendName: () => void;
};

export const useFriendStore = create<FriendStoreState>((set) => ({
  friends: [],
  friendId: '',
  friendName: '',
  setFriends: (newFriends: Friend[]) => set({ friends: newFriends }),
  updateFriendId: (newFriendId: string) => set({ friendId: newFriendId }),
  updateFriendName: (newFriendName: string) => set({ friendName: newFriendName }),
  removeFriendId: () => set({ friendId: '' }),
  removeFriendName: () => set({ friendName: '' }),
}));

// src/stores/counter-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { auth, signOut } from './api';
import { UserActions, UserState } from './type';

export const defaultInitState: UserState = {
  handling: false,
};

export const useUserStore = create<UserState & UserActions>()(
  devtools((set) => ({
    ...defaultInitState,
    login: async () => {
      set({ handling: true }, false, { type: 'user/auth' });
      const data = await auth();
      if (data) {
        set(
          (state) => ({
            ...state,
            info: data.info,
            isAdmin: data.isAdmin,
            isManager: data.isManager,
            isMaintenance: data.isMaintenance,
            handling: false,
          }),
          false,
          { type: 'user/auth' }
        );
      } else {
        set({ handling: false }, false, { type: 'user/auth' });
      }
    },
    signOut: async () => {
      set({ handling: true }, false, { type: 'user/auth' });
      await signOut();

      set(
        () => ({
          handling: false,
          info: undefined,
          isAdmin: undefined,
          isManager: undefined,
          isMaintenance: undefined,
        }),
        false,
        { type: 'user/auth' }
      );
    },
  }))
);

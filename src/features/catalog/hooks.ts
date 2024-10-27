// src/stores/counter-store.ts
import _ from 'lodash';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { getCatalog, updateCatalog } from './api';
import { CatalogActions, CatalogState } from './type';

export const defaultInitState: CatalogState = {
  handling: false,
  data: {
    users: {},
    rooms: {},
    device: {
      status: {},
      type: {},
    },
  },
};

export const useCatalogStore = create<CatalogState & CatalogActions>()(
  devtools((set) => ({
    ...defaultInitState,
    getCatalog: async () => {
      set({ handling: true }, false, { type: 'catalog/get' });
      const data = await getCatalog();
      if (!data) {
        set(
          () => ({
            handling: false,
          }),
          false,
          { type: 'device/getDevices' }
        );
        return;
      }
      set(
        () => ({
          data,
          handling: false,
        }),
        false,
        { type: 'device/getDevices' }
      );
    },
    updateCatalog: async (action, type, data) => {
      set({ handling: true }, false, { type: 'catalog/update' });
      const result = await updateCatalog(action, type, data);
      if (!result) {
        set(
          () => ({
            handling: false,
          }),
          false,
          { type: 'catalog/update' }
        );
        return;
      }
      set(
        (state) => {
          const newData = _.cloneDeep(state.data);
          const path = type.split('-');
          if (action === 'delete') {
            _.unset(newData, [...path, data.id]);
          } else {
            _.set(newData, [...path, result.id || data.id], {
              id: result.id || data.id,
              ...data,
            });
          }
          return {
            data: newData,
            handling: false,
          };
        },
        false,
        { type: 'catalog/update' }
      );
    },
  }))
);

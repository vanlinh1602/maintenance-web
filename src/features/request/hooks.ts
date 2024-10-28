// src/stores/counter-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  createRequest,
  deleteRequest,
  getRequest,
  getRequests,
  updateRequest,
} from './api';
import { Request, RequestActions, RequestState } from './type';

export const defaultInitState: RequestState = {
  handling: false,
  data: {},
};

export const useRequestStore = create<RequestState & RequestActions>()(
  devtools((set) => ({
    ...defaultInitState,
    getRequests: async () => {
      set({ handling: true }, false, { type: 'request/getRequests' });
      const data = await getRequests();
      set(
        (state) => ({
          data: {
            ...state.data,
            ...data.reduce((acc, item) => {
              acc[item.id] = item;
              return acc;
            }, {} as Record<string, Request>),
          },
          handling: false,
        }),
        false,
        { type: 'request/getRequests' }
      );
    },
    getRequest: async (id) => {
      set({ handling: true }, false, { type: 'request/getRequest' });
      const data = await getRequest(id);
      if (data) {
        set(
          (state) => ({
            data: {
              ...state.data,
              [data.id]: data,
            },
            handling: false,
          }),
          false,
          { type: 'request/getRequest' }
        );
      } else {
        set({ handling: false }, false, { type: 'request/getRequest' });
      }
    },
    createRequest: async (request) => {
      set({ handling: true }, false, { type: 'request/createRequest' });
      const data = await createRequest(request);
      if (data) {
        set(
          (state) => ({
            data: {
              ...state.data,
              [data.id]: data,
            },
            handling: false,
          }),
          false,
          { type: 'request/createRequest' }
        );
        return data;
      } else {
        set({ handling: false }, false, { type: 'request/createRequest' });
        return null;
      }
    },
    updateRequest: async (id, request) => {
      set({ handling: true }, false, { type: 'request/updateRequest' });
      const data = await updateRequest(id, request);
      if (data) {
        set(
          (state) => ({
            data: {
              ...state.data,
              [id]: {
                ...state.data[id],
                ...request,
              },
            },
            handling: false,
          }),
          false,
          { type: 'request/updateRequest' }
        );
      } else {
        set({ handling: false }, false, { type: 'request/updateRequest' });
      }
    },
    deleteRequest: async (id) => {
      set({ handling: true }, false, { type: 'request/deleteRequest' });
      const data = await deleteRequest(id);
      if (data) {
        set(
          (state) => {
            const newData = { ...state.data };
            delete newData[id];
            return {
              data: newData,
              handling: false,
            };
          },
          false,
          { type: 'request/deleteRequest' }
        );
      } else {
        set({ handling: false }, false, { type: 'request/deleteRequest' });
      }
    },
  }))
);

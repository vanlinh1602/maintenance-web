// src/stores/counter-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  createDevice,
  deleteDevice,
  getDevices,
  getFilterDevice,
  updateDevice,
} from './api';
import { Device, DeviceActions, DeviceState } from './type';

export const defaultInitState: DeviceState = {
  handling: false,
  data: {},
};

export const useDeviceStore = create<DeviceState & DeviceActions>()(
  devtools((set) => ({
    ...defaultInitState,
    getDevices: async () => {
      set({ handling: true }, false, { type: 'device/getDevices' });
      const data = await getDevices();
      set(
        (state) => ({
          data: {
            ...state.data,
            ...data.reduce((acc, item) => {
              acc[item.id] = item;
              return acc;
            }, {} as Record<string, Device>),
          },
          handling: false,
        }),
        false,
        { type: 'device/getDevices' }
      );
    },
    getFilterDevice: async (filter) => {
      set({ handling: true }, false, { type: 'device/getFilterDevice' });
      const data = await getFilterDevice(filter);
      if (data) {
        set(
          (state) => ({
            data: {
              ...state.data,
              ...data.reduce((acc, item) => {
                acc[item.id] = item;
                return acc;
              }, {} as Record<string, Device>),
            },
            handling: false,
          }),
          false,
          { type: 'device/getFilterDevice' }
        );
      } else {
        set({ handling: false }, false, { type: 'device/getFilterDevice' });
      }
    },
    createDevice: async (device) => {
      set({ handling: true }, false, { type: 'device/createDevice' });
      const data = await createDevice(device);
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
          { type: 'device/createDevice' }
        );
      } else {
        set({ handling: false }, false, { type: 'device/createDevice' });
      }
    },
    updateDevice: async (id, device) => {
      set({ handling: true }, false, { type: 'device/updateDevice' });
      const data = await updateDevice(id, device);
      if (data) {
        set(
          (state) => ({
            data: {
              ...state.data,
              [id]: {
                ...state.data[id],
                ...device,
              },
            },
            handling: false,
          }),
          false,
          { type: 'device/updateDevice' }
        );
      } else {
        set({ handling: false }, false, { type: 'device/updateDevice' });
      }
    },
    deleteDevice: async (id) => {
      set({ handling: true }, false, { type: 'device/deleteDevice' });
      const data = await deleteDevice(id);
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
          { type: 'device/deleteDevice' }
        );
      } else {
        set({ handling: false }, false, { type: 'device/deleteDevice' });
      }
    },
  }))
);

// src/stores/counter-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  createLiquidation,
  deleteLiquidation,
  getLiquidation,
  getLiquidationByFilter,
  getLiquidations,
  updateLiquidation,
} from './api';
import { Liquidation, LiquidationActions, LiquidationState } from './type';

export const defaultInitState: LiquidationState = {
  handling: false,
  data: {},
};

export const useLiquidationStore = create<
  LiquidationState & LiquidationActions
>()(
  devtools((set) => ({
    ...defaultInitState,
    getLiquidations: async () => {
      set({ handling: true }, false, { type: 'liquidation/getLiquidations' });
      const data = await getLiquidations();
      set(
        (state) => ({
          data: {
            ...state.data,
            ...data.reduce((acc, item) => {
              acc[item.id] = item;
              return acc;
            }, {} as Record<string, Liquidation>),
          },
          handling: false,
        }),
        false,
        { type: 'liquidation/getLiquidations' }
      );
    },
    getLiquidation: async (id) => {
      set({ handling: true }, false, { type: 'liquidation/getLiquidation' });
      const data = await getLiquidation(id);
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
          { type: 'liquidation/getLiquidation' }
        );
      } else {
        set({ handling: false }, false, { type: 'liquidation/getLiquidation' });
      }
    },
    getLiquidationByFilter: async (filter) => {
      set({ handling: true }, false, {
        type: 'liquidation/getLiquidationByFilter',
      });
      const data = await getLiquidationByFilter(filter);
      if (data) {
        set(
          (state) => ({
            data: {
              ...state.data,
              ...data.reduce((acc, item) => {
                acc[item.id] = item;
                return acc;
              }, {} as Record<string, Liquidation>),
            },
            handling: false,
          }),
          false,
          { type: 'liquidation/getLiquidationByFilter' }
        );
      } else {
        set({ handling: false }, false, {
          type: 'liquidation/getLiquidationByFilter',
        });
      }
    },
    createLiquidation: async (liquidation) => {
      set({ handling: true }, false, { type: 'liquidation/createLiquidation' });
      const data = await createLiquidation(liquidation);
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
          { type: 'liquidation/createLiquidation' }
        );
        return data;
      } else {
        set({ handling: false }, false, {
          type: 'liquidation/createLiquidation',
        });
        return null;
      }
    },
    updateLiquidation: async (id, liquidation) => {
      set({ handling: true }, false, { type: 'liquidation/updateLiquidation' });
      const data = await updateLiquidation(id, liquidation);
      if (data) {
        set(
          (state) => ({
            data: {
              ...state.data,
              [id]: {
                ...state.data[id],
                ...liquidation,
              },
            },
            handling: false,
          }),
          false,
          { type: 'liquidation/updateLiquidation' }
        );
      } else {
        set({ handling: false }, false, {
          type: 'liquidation/updateLiquidation',
        });
      }
    },
    deleteLiquidation: async (id) => {
      set({ handling: true }, false, { type: 'liquidation/deleteLiquidation' });
      const data = await deleteLiquidation(id);
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
          { type: 'liquidation/deleteLiquidation' }
        );
      } else {
        set({ handling: false }, false, {
          type: 'liquidation/deleteLiquidation',
        });
      }
    },
  }))
);

export interface Liquidation {
  id: string;
  deviceId: string;
  requestBy: string;
  status: string;
  reason: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LiquidationState = {
  handling: boolean;
  data: Record<string, Liquidation>;
};

export type LiquidationActions = {
  getLiquidations: () => Promise<void>;
  getLiquidation: (id: string) => Promise<void>;
  getLiquidationByFilter: (filter: Partial<Liquidation>) => Promise<void>;
  createLiquidation: (
    liquidation: Partial<Liquidation>
  ) => Promise<Liquidation | null>;
  updateLiquidation: (
    id: string,
    liquidation: Partial<Liquidation>
  ) => Promise<void>;
  deleteLiquidation: (id: string) => Promise<void>;
};

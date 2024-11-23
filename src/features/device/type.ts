export interface Device {
  id: string;
  name: string;
  serial: string;
  description?: string;
  purchaseDate: number;
  assignedDate?: number;
  warrantyExpireDate: number;
  status: string;
  roomId?: string;
  employeeId?: string;
  type: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DeviceState = {
  handling: boolean;
  data: Record<string, Device>;
};

export type DeviceActions = {
  getDevices: () => void;
  getFilterDevice: (filter: Partial<Device>) => void;
  createDevice: (device: Partial<Device>) => void;
  updateDevice: (id: string, device: Partial<Device>) => void;
  deleteDevice: (id: string) => void;
};

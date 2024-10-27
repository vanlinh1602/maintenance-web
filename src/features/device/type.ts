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
  categoryId: string;
}

export type DeviceState = {
  handling: boolean;
  data: Record<string, Device>;
};

export type DeviceActions = {
  getDevices: () => void;
  getDevice: (id: string) => void;
  createDevice: (device: Partial<Device>) => void;
  updateDevice: (id: string, device: Partial<Device>) => void;
  deleteDevice: (id: string) => void;
};

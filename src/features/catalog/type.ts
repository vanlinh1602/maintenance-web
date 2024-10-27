import { User } from '../user/type';

export type Room = {
  id: string;
  name: string;
  leader: string;
};

export type DeviceStatus = {
  id: string;
  status: string;
};

export type DeviceType = {
  id: string;
  type: string;
};

export interface Catalog {
  users: CustomObject<User>;
  rooms: CustomObject<Room>;
  device: {
    status: CustomObject<DeviceStatus>;
    type: CustomObject<DeviceType>;
  };
}

export type CatalogState = {
  handling: boolean;
  data: Catalog;
};

export type CatalogActions = {
  getCatalog: () => void;
  updateCatalog: (
    action: 'add' | 'edit' | 'delete',
    type: 'users' | 'rooms' | 'device-status' | 'device-type',
    data: any
  ) => void;
};

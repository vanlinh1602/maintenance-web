import { User } from '../user/type';

export type Room = {
  id: string;
  name: string;
  leader: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Role = {
  id: string;
  name: string;
  isAdmin: boolean;
  isManager: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type DeviceStatus = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type DeviceType = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RequestStatus = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RequestType = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export interface Catalog {
  users: CustomObject<User>;
  rooms: CustomObject<Room>;
  roles: CustomObject<Role>;
  device: {
    status: CustomObject<DeviceStatus>;
    type: CustomObject<DeviceType>;
  };
  request: {
    status: CustomObject<RequestStatus>;
    type: CustomObject<RequestType>;
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
    type:
      | 'users'
      | 'rooms'
      | 'roles'
      | 'device-status'
      | 'device-type'
      | 'request-status'
      | 'request-type',
    data: any
  ) => void;
};

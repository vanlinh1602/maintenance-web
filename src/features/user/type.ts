export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthdate: number;
  gender: string;
  address: string;
  citizenId: string;
  roleId: string;
  roomId: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserState = {
  handling: boolean;
  info?: User;
  isAdmin?: boolean;
  isManager?: boolean;
  isMaintenance?: boolean;
};

export type UserActions = {
  login(): Promise<void>;
  signOut(): Promise<void>;
};

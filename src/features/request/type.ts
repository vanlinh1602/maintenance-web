export interface Request {
  id: string;
  type: string;
  description: string;
  notes?: {
    userId: string;
    message: string;
    timestamp: number;
  }[];
  status: string;
  scheduledDate?: number;
  completedDate?: number;
  creator: string;
  assignedTo?: string;
  deviceId: string;
  replacementDeviceId?: string;
  priority: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RequestState = {
  handling: boolean;
  data: Record<string, Request>;
};

export type RequestActions = {
  getRequests: () => Promise<void>;
  getRequest: (id: string) => Promise<void>;
  getRequestByFilter: (filter: Partial<Request>) => Promise<void>;
  createRequest: (request: Partial<Request>) => Promise<Request | null>;
  updateRequest: (id: string, request: Partial<Request>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
};

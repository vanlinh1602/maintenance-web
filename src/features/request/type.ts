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
  createdDate: number;
  completedDate?: number;
  creator: string;
  assignedTo?: string;
  deviceId: string;
  priority: string;
}

export type RequestState = {
  handling: boolean;
  data: Record<string, Request>;
};

export type RequestActions = {
  getRequests: () => Promise<void>;
  getRequest: (id: string) => Promise<void>;
  createRequest: (request: Partial<Request>) => Promise<Request | null>;
  updateRequest: (id: string, request: Partial<Request>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
};

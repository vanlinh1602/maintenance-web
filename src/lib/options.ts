export const priorities: CustomObject<{
  name: string;
  color: string;
}> = {
  low: {
    name: 'Low',
    color: 'green',
  },
  medium: {
    name: 'Medium',
    color: 'orange',
  },
  high: {
    name: 'High',
    color: 'red',
  },
  critical: {
    name: 'Critical',
    color: 'purple',
  },
};

export const requestStatuses: CustomObject<{
  name: string;
  color: string;
}> = {
  pending: {
    name: 'Pending',
    color: 'gray',
  },
  approved: {
    name: 'Approved',
    color: 'green',
  },
  inProgress: {
    name: 'In Progress',
    color: 'blue',
  },
  rejected: {
    name: 'Rejected',
    color: 'red',
  },
  completed: {
    name: 'Completed',
    color: 'green',
  },
};

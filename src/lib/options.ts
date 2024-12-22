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
  done: {
    name: 'Done',
    color: 'violet',
  },
  completed: {
    name: 'Completed',
    color: 'orange',
  },
};

export const deviceStatuses: CustomObject<{
  name: string;
  color: string;
}> = {
  active: {
    name: 'Active',
    color: 'green',
  },
  inactive: {
    name: 'Inactive',
    color: 'red',
  },
  damaged: {
    name: 'Damaged',
    color: 'red',
  },
  repair: {
    name: 'Repair',
    color: 'orange',
  },
  liquidation: {
    name: 'For Liquidation',
    color: 'purple',
  },
};

export const liquidationStautses: CustomObject<{
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
  rejected: {
    name: 'Rejected',
    color: 'red',
  },
  completed: {
    name: 'Completed',
    color: 'green',
  },
};

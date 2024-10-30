import { format } from 'date-fns';
import { CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useDeviceStore } from '@/features/device/hooks';
import { useRequestStore } from '@/features/request/hooks';

// Mock data for a specific maintenance task
const maintenanceData = {
  id: 1,
  equipment: 'Forklift A',
  type: 'Routine',
  status: 'Scheduled',
  scheduledDate: '2023-12-15',
  assignedTo: 'John Doe',
  description:
    'Perform routine maintenance including oil change, brake inspection, and general system check.',
  estimatedDuration: '2 hours',
  priority: 'Medium',
  notes: [
    {
      date: '2023-11-20',
      author: 'Jane Smith',
      content: 'Ordered necessary parts for the maintenance.',
    },
    {
      date: '2023-11-25',
      author: 'Mike Johnson',
      content:
        'Confirmed availability of the equipment for the scheduled date.',
    },
  ],
  checklist: [
    { id: 1, task: 'Change oil', completed: false },
    { id: 2, task: 'Inspect brakes', completed: false },
    { id: 3, task: 'Check hydraulic system', completed: false },
    { id: 4, task: 'Test all safety features', completed: false },
    { id: 5, task: 'Lubricate moving parts', completed: false },
  ],
};

export default function MaintenanceDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { requests, getRequest } = useRequestStore(
    useShallow((state) => ({
      requests: state.data,
      getRequest: state.getRequest,
    }))
  );

  const { devices, getDevices } = useDeviceStore(
    useShallow((state) => ({
      devices: state.data,
      getDevices: state.getDevices,
    }))
  );

  const request = useMemo(() => requests[id!] || {}, [requests, id]);

  useEffect(() => {
    if (!request.id) {
      getRequest(id!);
    }
    if (!Object.keys(devices).length) {
      getDevices();
    }
  }, [devices, request.id, getRequest, getDevices, id]);

  const [checklist, setChecklist] = useState(maintenanceData.checklist);

  const toggleChecklistItem = (idCheck: number) => {
    setChecklist(
      checklist.map((item) =>
        item.id === idCheck ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {maintenanceData.type} Maintenance
          </h1>
          <p className="text-xl text-muted-foreground">
            {maintenanceData.equipment}
          </p>
        </div>
        <Badge
          variant={
            maintenanceData.status === 'Completed'
              ? 'default'
              : maintenanceData.status === 'In Progress'
              ? 'secondary'
              : 'outline'
          }
          className="text-lg py-1 px-3"
        >
          {maintenanceData.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Scheduled Date</Label>
                <p>
                  {format(
                    new Date(maintenanceData.scheduledDate),
                    'MMMM d, yyyy'
                  )}
                </p>
              </div>
              <div>
                <Label>Assigned To</Label>
                <p>{maintenanceData.assignedTo}</p>
              </div>
              <div>
                <Label>Estimated Duration</Label>

                <p>{maintenanceData.estimatedDuration}</p>
              </div>
              <div>
                <Label>Priority</Label>
                <p>{maintenanceData.priority}</p>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <p>{maintenanceData.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {checklist.map((item) => (
                <li key={item.id} className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleChecklistItem(item.id)}
                  >
                    {item.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-300" />
                    )}
                  </Button>
                  <span
                    className={
                      item.completed ? 'line-through text-muted-foreground' : ''
                    }
                  >
                    {item.task}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Maintenance Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {maintenanceData.notes.map((note, index) => (
                <li key={index} className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold">{note.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(note.date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <p className="mt-2">{note.content}</p>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Add Note</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-6 flex space-x-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Update Maintenance Status</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Maintenance Status</DialogTitle>
              <DialogDescription>
                Change the current status of this maintenance task.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status-notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="status-notes"
                  placeholder="Add any relevant notes about this status change..."
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Update Status</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="outline">Generate Report</Button>
      </div>
    </div>
  );
}

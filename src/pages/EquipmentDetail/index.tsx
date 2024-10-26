'use client';

import { format } from 'date-fns';
import { AlertTriangle, ArrowLeft, CalendarIcon, Wrench } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Mock data for a specific piece of equipment
const equipmentData = {
  id: 1,
  name: 'Forklift A',
  type: 'Forklift',
  model: 'Toyota 8FBN25',
  serialNumber: 'TY8FBN25-12345',
  purchaseDate: '2020-05-15',
  status: 'Operational',
  lastMaintenance: '2023-09-15',
  nextScheduledMaintenance: '2023-12-15',
  location: 'Warehouse A',
  assignedTo: 'John Doe',
  specifications: {
    liftCapacity: '2500 kg',
    maxLiftHeight: '6 meters',
    powerType: 'Electric',
  },
  maintenanceHistory: [
    {
      date: '2023-09-15',
      type: 'Routine',
      description: 'Oil change and general inspection',
    },
    {
      date: '2023-06-10',
      type: 'Repair',
      description: 'Replaced worn out tires',
    },
    {
      date: '2023-03-22',
      type: 'Routine',
      description: 'Battery check and lubrication',
    },
  ],
};

export default function EquipmentDetailsPage() {
  const [date, setDate] = useState<Date | undefined>(
    new Date(equipmentData.nextScheduledMaintenance)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Equipment List
      </Button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{equipmentData.name}</h1>
          <p className="text-xl text-muted-foreground">{equipmentData.type}</p>
        </div>
        <Badge
          variant={
            equipmentData.status === 'Operational'
              ? 'default'
              : equipmentData.status === 'In Maintenance'
              ? 'secondary'
              : 'destructive'
          }
          className="text-lg py-1 px-3"
        >
          {equipmentData.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Equipment Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Model</Label>
                <p>{equipmentData.model}</p>
              </div>
              <div>
                <Label>Serial Number</Label>
                <p>{equipmentData.serialNumber}</p>
              </div>
              <div>
                <Label>Purchase Date</Label>
                <p>
                  {format(new Date(equipmentData.purchaseDate), 'MMMM d, yyyy')}
                </p>
              </div>
              <div>
                <Label>Location</Label>
                <p>{equipmentData.location}</p>
              </div>
              <div>
                <Label>Assigned To</Label>
                <p>{equipmentData.assignedTo}</p>
              </div>
              <div>
                <Label>Last Maintenance</Label>
                <p>
                  {format(
                    new Date(equipmentData.lastMaintenance),
                    'MMMM d, yyyy'
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {Object.entries(equipmentData.specifications).map(
              ([key, value]) => (
                <div key={key}>
                  <Label>
                    {key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, (str) => str.toUpperCase())}
                  </Label>
                  <p>{value}</p>
                </div>
              )
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Maintenance History</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {equipmentData.maintenanceHistory.map((maintenance, index) => (
                <li key={index} className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">
                        {maintenance.type} Maintenance
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(maintenance.date), 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <Badge
                      variant={
                        maintenance.type === 'Routine' ? 'secondary' : 'default'
                      }
                    >
                      {maintenance.type}
                    </Badge>
                  </div>
                  <p className="mt-2">{maintenance.description}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex space-x-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Wrench className="mr-2 h-4 w-4" /> Schedule Maintenance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Maintenance</DialogTitle>
              <DialogDescription>
                Set the date and details for the next maintenance.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maintenance-date" className="text-right">
                  Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={`col-span-3 ${
                        !date && 'text-muted-foreground'
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maintenance-type" className="text-right">
                  Type
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select maintenance type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maintenance-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="maintenance-description"
                  placeholder="Describe the maintenance task..."
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <AlertTriangle className="mr-2 h-4 w-4" /> Report Issue
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report an Issue</DialogTitle>
              <DialogDescription>
                Describe the problem you're experiencing with this equipment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="issue-type" className="text-right">
                  Issue Type
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select issue type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mechanical">Mechanical</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="issue-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="issue-description"
                  placeholder="Describe the issue in detail..."
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Submit Report</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

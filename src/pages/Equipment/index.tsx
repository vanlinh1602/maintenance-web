'use client';

import { MoreHorizontal, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Mock data for equipment
const equipmentData = [
  {
    id: 1,
    name: 'Forklift A',
    type: 'Forklift',
    status: 'Operational',
    lastMaintenance: '2023-09-15',
  },
  {
    id: 2,
    name: 'CNC Machine B',
    type: 'CNC Machine',
    status: 'In Maintenance',
    lastMaintenance: '2023-10-01',
  },
  {
    id: 3,
    name: 'Conveyor Belt C',
    type: 'Conveyor',
    status: 'Operational',
    lastMaintenance: '2023-08-30',
  },
  {
    id: 4,
    name: 'Drill Press D',
    type: 'Drill Press',
    status: 'In Repair',
    lastMaintenance: '2023-09-22',
  },
  {
    id: 5,
    name: 'Lathe E',
    type: 'Lathe',
    status: 'Operational',
    lastMaintenance: '2023-10-05',
  },
];

export default function EquipmentPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [repairEquipment, setRepairEquipment] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const filteredEquipment = equipmentData.filter(
    (equipment) =>
      equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'All' || equipment.status === statusFilter)
  );

  const RepairRequestDialog = () => (
    <Dialog
      open={!!repairEquipment}
      onOpenChange={() => setRepairEquipment(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Repair for {repairEquipment?.name}</DialogTitle>
          <DialogDescription>
            Please provide details about the issue you're experiencing with this
            equipment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="issue" className="text-right">
              Issue Description
            </Label>
            <Textarea
              id="issue"
              placeholder="Describe the problem in detail..."
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="urgency" className="text-right">
              Urgency
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select urgency level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Submit Repair Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Equipment Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New Equipment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Equipment</DialogTitle>
              <DialogDescription>
                Enter the details of the new equipment here. Click save when
                you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Input id="type" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="maintenance">In Maintenance</SelectItem>
                    <SelectItem value="repair">In Repair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search equipment..."
              className="pl-8 md:w-[300px] lg:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select onValueChange={(value) => setStatusFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Operational">Operational</SelectItem>
              <SelectItem value="In Maintenance">In Maintenance</SelectItem>
              <SelectItem value="In Repair">In Repair</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Schedule Maintenance</Button>
          <Button variant="outline">Generate Report</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEquipment.map((equipment) => (
          <Card key={equipment.id}>
            <CardHeader>
              <CardTitle>{equipment.name}</CardTitle>
              <CardDescription>{equipment.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Badge
                  variant={
                    equipment.status === 'Operational'
                      ? 'default'
                      : equipment.status === 'In Maintenance'
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {equipment.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Last Maintenance: {equipment.lastMaintenance}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onSelect={() => navigate(`/equipment/${equipment.id}`)}
                  >
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => console.log('Edit Equipment')}
                  >
                    Edit Equipment
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => console.log('Schedule Maintenance')}
                  >
                    Schedule Maintenance
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      setRepairEquipment({
                        id: equipment.id,
                        name: equipment.name,
                      })
                    }
                  >
                    Request Repair
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onSelect={() => console.log('Delete Equipment')}
                  >
                    Delete Equipment
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
      <RepairRequestDialog />
    </div>
  );
}

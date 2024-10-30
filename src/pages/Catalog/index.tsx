import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DeviceStatusTab,
  DeviceTypeTab,
  RequestStatusTab,
  RequestTypeTab,
  RolesTab,
  RoomsTab,
  UsersTab,
} from '@/features/catalog/components';

export default function Catalog() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Company Control Panel</h1>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="flex justify-between">
          <div>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
          </div>
          <div>
            <TabsTrigger value="device-status">Device Status</TabsTrigger>
            <TabsTrigger value="device-type">Device Type</TabsTrigger>
            <TabsTrigger value="request-status">Request Status</TabsTrigger>
            <TabsTrigger value="request-type">Request Type</TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        <TabsContent value="rooms">
          <RoomsTab />
        </TabsContent>
        <TabsContent value="roles">
          <RolesTab />
        </TabsContent>
        <TabsContent value="device-status">
          <DeviceStatusTab />
        </TabsContent>
        <TabsContent value="device-type">
          <DeviceTypeTab />
        </TabsContent>

        <TabsContent value="request-status">
          <RequestStatusTab />
        </TabsContent>
        <TabsContent value="request-type">
          <RequestTypeTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

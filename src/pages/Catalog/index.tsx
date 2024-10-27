import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DeviceStatusTab,
  RoomsTab,
  UsersTab,
} from '@/features/catalog/components';
import DeviceTypeTab from '@/features/catalog/components/DeviceStatusType';

export default function Catalog() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Company Control Panel</h1>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="device-status">Device Status</TabsTrigger>
          <TabsTrigger value="device-type">Device Type</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTab />
        </TabsContent>

        <TabsContent value="rooms">
          <RoomsTab />
        </TabsContent>

        <TabsContent value="device-status">
          <DeviceStatusTab />
        </TabsContent>
        <TabsContent value="device-type">
          <DeviceTypeTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

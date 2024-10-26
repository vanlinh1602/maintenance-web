import './App.css';

import { ScrollArea } from '@radix-ui/react-scroll-area';
import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { Header } from './features/layouts/Header';

const DashboardPage = lazy(() => import('./pages/Dashboard'));
const EquipmentPage = lazy(() => import('./pages/Equipment'));
const MaintenancePage = lazy(() => import('./pages/Maintenance'));
const ReportsPage = lazy(() => import('./pages/Reports'));
const ControlPage = lazy(() => import('./pages/Control'));
const EquipmentDetailPage = lazy(() => import('./pages/EquipmentDetail'));
const MaintenanceDetailPage = lazy(() => import('./pages/MaintenanceDetail'));

const AppLayout = () => (
  <Suspense>
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
        <ScrollArea>
          <Outlet />
        </ScrollArea>
      </div>
    </div>
  </Suspense>
);

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/equipment" element={<Outlet />}>
          <Route path=":id" element={<EquipmentDetailPage />} />
          <Route path="" element={<EquipmentPage />} />
        </Route>
        <Route path="/maintenance" element={<Outlet />}>
          <Route path=":id" element={<MaintenanceDetailPage />} />
          <Route path="" element={<MaintenancePage />} />
        </Route>
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/control" element={<ControlPage />} />
        <Route
          path="*"
          element={
            <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
              Trang không tồn tại
            </div>
          }
        />
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

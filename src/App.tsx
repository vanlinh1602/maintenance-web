import './App.css';

import { ScrollArea } from '@radix-ui/react-scroll-area';
import { lazy, Suspense, useEffect } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

import { Waiting } from './components';
import { useCatalogStore } from './features/catalog/hooks';
import { Header } from './features/layouts/Header';

const DashboardPage = lazy(() => import('./pages/Dashboard'));
const DevicePage = lazy(() => import('./pages/Device'));
const RequestPage = lazy(() => import('./pages/Request'));
const ReportsPage = lazy(() => import('./pages/Reports'));
const CatalogPage = lazy(() => import('./pages/Catalog'));
const DeviceDetailPage = lazy(() => import('./pages/DeviceDetail'));
const RequestDetailPage = lazy(() => import('./pages/RequestDetail'));

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
  const { handling, getCatalog } = useCatalogStore(
    useShallow((state) => ({
      handling: state.handling,
      getCatalog: state.getCatalog,
    }))
  );

  useEffect(() => {
    getCatalog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/device" element={<Outlet />}>
          <Route path=":id" element={<DeviceDetailPage />} />
          <Route path="" element={<DevicePage />} />
        </Route>
        <Route path="/request" element={<Outlet />}>
          <Route path=":id" element={<RequestDetailPage />} />
          <Route path="" element={<RequestPage />} />
        </Route>
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
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
      {handling ? <Waiting /> : null}
      <RouterProvider router={router} />
    </>
  );
}

export default App;

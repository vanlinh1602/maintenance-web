import './App.css';

import { ScrollArea } from '@radix-ui/react-scroll-area';
import { onAuthStateChanged } from 'firebase/auth';
import { lazy, Suspense, useEffect } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

import AuthorizedRoute from './AuthorizedRoute';
import { Waiting } from './components';
import { useCatalogStore } from './features/catalog/hooks';
import { Header } from './features/layouts/Header';
import { useUserStore } from './features/user/hooks';
import { auth } from './services/firebase';

const DashboardPage = lazy(() => import('./pages/Dashboard'));
const DevicePage = lazy(() => import('./pages/Device'));
const RequestPage = lazy(() => import('./pages/Request'));
// const ReportsPage = lazy(() => import('./pages/Reports'));
const CatalogPage = lazy(() => import('./pages/Catalog'));
const DeviceDetailPage = lazy(() => import('./pages/DeviceDetail'));
const RequestDetailPage = lazy(() => import('./pages/RequestDetail'));
const LiquidationRequestPage = lazy(() => import('./pages/LiquidationRequest'));
const LoginPage = lazy(() => import('./pages/Login'));

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
  const { login } = useUserStore(
    useShallow((state) => ({
      login: state.login,
    }))
  );

  useEffect(() => {
    getCatalog();

    return onAuthStateChanged(auth, (user) => {
      if (user) {
        login();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AppLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<AuthorizedRoute />}>
          <Route index element={<DashboardPage />} />
        </Route>
        <Route path="/device" element={<AuthorizedRoute />}>
          <Route path=":id" element={<DeviceDetailPage />} />
          <Route path="" element={<DevicePage />} />
        </Route>
        <Route path="/request" element={<AuthorizedRoute />}>
          <Route path=":id" element={<RequestDetailPage />} />
          <Route path="" element={<RequestPage />} />
        </Route>
        {/* <Route path="/reports" element={<ReportsPage />} /> */}
        <Route path="/catalog" element={<AuthorizedRoute />}>
          <Route index element={<CatalogPage />} />
        </Route>
        <Route path="/liquidation" element={<AuthorizedRoute />}>
          <Route index element={<LiquidationRequestPage />} />
        </Route>
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

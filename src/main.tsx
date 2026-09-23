import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
//import DispatchListingPage from './pages/DispatchListingPage.tsx';
import CreateDispatchPage from './pages/CreateDispatchPage.tsx';
import UpdateDispatchPage from './pages/UpdateDispatchPage.tsx';
import LoadPage from './pages/LoadPage.tsx';
import DetailPage from './pages/DetailPage.tsx';
import LoginPage from './pages/LoginPage.tsx';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { AuthProvider } from './contexts/AuthProvider.tsx';
import RequireAuth from './contexts/RequireAuth.tsx';
import RequireCompanyType from './contexts/RequireCompanyType.tsx';
dayjs.extend(utc);

const router = createBrowserRouter([
  {
    path: '/',
    element: <RequireAuth><App /></RequireAuth>,
    children: [
      { index: true, element: <LoadPage /> },
      { path: 'create', element: <RequireCompanyType allow={['Shipper']}><CreateDispatchPage /></RequireCompanyType> },
      { path: 'dispatch/:dispatchId', element: <DetailPage /> },
      { path: 'dispatch/:dispatchId/edit', element: <RequireCompanyType allow={['Shipper']}><UpdateDispatchPage /></RequireCompanyType> }
    ]
  },
  {
    path: 'account',
    children: [
      {
        path: 'login',
        element: <LoginPage />
      }
    ]
  }
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);

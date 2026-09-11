import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DispatchListingPage from './pages/DispatchListingPage.tsx';
import CreateDispatchPage from './pages/CreateDispatchPage.tsx';
import LoadPage from './pages/LoadPage.tsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <DispatchListingPage /> },
      { path: 'create', element: <CreateDispatchPage /> },
      { path: 'dispatch/shipper', element: <LoadPage /> }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

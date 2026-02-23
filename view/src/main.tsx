import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CustomProvider } from 'rsuite'
import 'rsuite/dist/rsuite.min.css'

import AdminLayout from './layouts/AdminLayout'
import DashboardPage from './pages/DashboardPage'
import DomainsPage from './pages/DomainsPage'
import EndpointsPage from './pages/EndpointsPage'
import UsersPage from './pages/UsersPage'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'domains', element: <DomainsPage /> },
      { path: 'endpoints', element: <EndpointsPage /> },
      { path: 'users', element: <UsersPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CustomProvider theme="dark">
        <RouterProvider router={router} />
      </CustomProvider>
    </QueryClientProvider>
  </StrictMode>,
)

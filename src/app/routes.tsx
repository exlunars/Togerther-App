import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router';
import { HomePage } from './components/HomePage';
import { MeetingDetailPage } from './components/MeetingDetailPage';
import { MeetingProvider } from './store/meetingContext';

function RootLayout() {
  return (
    <MeetingProvider>
      <Outlet />
    </MeetingProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: 'meeting/:id',
        Component: MeetingDetailPage,
      },
    ],
  },
]);
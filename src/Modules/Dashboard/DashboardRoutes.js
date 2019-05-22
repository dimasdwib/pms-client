import React from 'react'; // eslint-disable-line no-unused-vars
import Loadable from 'react-loadable';
import PageLoader from '../../Components/Layout/Admin/PageLoader';

const DashboardPage = Loadable({
  loader: () => import('./Components/DashboardPage'),
  loading: PageLoader,
});


export default [
  {
    path: '/dashboard',
    child: [
      {
        path: '/',
        component: () => <DashboardPage />
      },
    ],
  }
]

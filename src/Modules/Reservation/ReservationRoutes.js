import React from 'react'; // eslint-disable-line no-unused-vars
import Loadable from 'react-loadable';
import PageLoader from '../../Components/Layout/Admin/PageLoader';

const ReservationPage = Loadable({
  loader: () => import('./Components/ReservationPage'),
  loading: PageLoader,
});

export default [
  {
    path: '/reservation',
    child: [
      {
        path: '/',
        component: () => (<ReservationPage />)
      },
    ],
  }
]

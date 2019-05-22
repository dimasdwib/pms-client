import React from 'react'; // eslint-disable-line no-unused-vars
import Loadable from 'react-loadable';
import PageLoader from '../../Components/Layout/Admin/PageLoader';

const HouseKeppingPage = Loadable({
  loader: () => import('./Components/HouseKeppingPage'),
  loading: PageLoader,
});

export default [
  {
    path: '/housekeeping',
    child: [
      {
        path: '/',
        component: () => (<HouseKeppingPage />)
      },
    ],
  }
]

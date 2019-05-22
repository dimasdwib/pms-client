import React from 'react'; // eslint-disable-line no-unused-vars
import Loadable from 'react-loadable';
import PageLoader from '../../Components/Layout/Admin/PageLoader';

const BedPage = Loadable({
  loader: () => import('./Components/BedPage'),
  loading: PageLoader,
});

export default [
  {
    path: '/bed',
    child: [
      {
        path: '/',
        component: () => (<BedPage />)
      },
    ],
  }
]

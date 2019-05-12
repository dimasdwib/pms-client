import React from 'react'; // eslint-disable-line no-unused-vars
import Loadable from 'react-loadable';
import PageLoader from '../../Components/Layout/Admin/PageLoader';

const FloorPage = Loadable({
  loader: () => import('./Components/FloorPage'),
  loading: PageLoader,
});

export default [
  {
    path: '/floor',
    child: [
      {
        path: '/',
        component: () => (<FloorPage />)
      },
    ],
  }
]

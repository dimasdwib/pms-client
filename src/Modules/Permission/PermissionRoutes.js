import React from 'react'; // eslint-disable-line no-unused-vars
import Loadable from 'react-loadable';
import PageLoader from '../../Components/Layout/Admin/PageLoader';

const PermissionPage = Loadable({
  loader: () => import('./Components/PermissionPage'),
  loading: PageLoader,
});

export default [
  {
    path: '/permission',
    child: [
      {
        path: '/',
        component: () => (<PermissionPage />)
      },
    ],
  }
]

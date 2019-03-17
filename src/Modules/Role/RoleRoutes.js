import React from 'react'; // eslint-disable-line no-unused-vars
import Loadable from 'react-loadable';
import PageLoader from '../../Components/Layout/Admin/PageLoader';

const RolePage = Loadable({
  loader: () => import('./Components/RolePage'),
  loading: PageLoader,
});

export default [
  {
    path: '/role',
    child: [
      {
        path: '/',
        component: () => (<RolePage />)
      },
    ],
  }
]

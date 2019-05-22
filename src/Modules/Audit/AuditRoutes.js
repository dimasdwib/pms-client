import React from 'react'; // eslint-disable-line no-unused-vars
import Loadable from 'react-loadable';
import PageLoader from '../../Components/Layout/Admin/PageLoader';

const AuditPage = Loadable({
  loader: () => import('./Components/AuditPage'),
  loading: PageLoader,
});

export default [
  {
    path: '/audit',
    child: [
      {
        path: '/',
        component: () => (<AuditPage />)
      },
    ],
  }
]

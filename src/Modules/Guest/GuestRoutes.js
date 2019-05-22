import React from 'react'; // eslint-disable-line no-unused-vars
import Loadable from 'react-loadable';
import PageLoader from '../../Components/Layout/Admin/PageLoader';

const GuestPage = Loadable({
  loader: () => import('./Components/GuestPage'),
  loading: PageLoader,
});

const GuestForm = Loadable({
  loader: () => import('./Components/GuestForm'),
  loading: PageLoader,
});

export default [
  {
    path: '/guest',
    child: [
      {
        path: '/',
        component: () => (<GuestPage />)
      },
      {
        path: '/create',
        component: () => (<GuestForm />),
      },
      {
        path: '/:id',
        component: (route) => (<GuestForm id={route.match.params.id} />),
      },
    ],
  }
]

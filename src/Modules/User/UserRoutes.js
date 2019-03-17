import React from 'react'; // eslint-disable-line no-unused-vars
import Loadable from 'react-loadable';
import PageLoader from '../../Components/Layout/Admin/PageLoader';

const UserPage = Loadable({
  loader: () => import('./Components/UserPage'),
  loading: PageLoader,
});

const UserForm = Loadable({
  loader: () => import('./Components/UserForm'),
  loading: PageLoader,
});

const UserProfile = Loadable({
  loader: () => import('./Components/UserProfile'),
  loading: PageLoader,
});

export default [
  {
    path: '/user',
    child: [
      {
        path: '/',
        component: () => (<UserPage />),
      },
      {
        path: '/profile',
        component: () => (<UserProfile />),
      },
      {
        path: '/create',
        component: () => (<UserForm />),
      },
      {
        path: '/:id',
        component: (route) => (<UserForm id={route.match.params.id} />),
      },
    ],
  }
]

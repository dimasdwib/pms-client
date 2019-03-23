import React from 'react'; // eslint-disable-line no-unused-vars
import Loadable from 'react-loadable';
import PageLoader from '../../Components/Layout/Admin/PageLoader';

const RatePage = Loadable({
  loader: () => import('./Components/RatePage'),
  loading: PageLoader,
});

export default [
  {
    path: '/rate',
    child: [
      {
        path: '/',
        component: () => (<RatePage />)
      },
    ],
  }
]

import React from 'react'; // eslint-disable-line no-unused-vars
import Loadable from 'react-loadable';
import PageLoader from '../../Components/Layout/Admin/PageLoader';

const RoomPage = Loadable({
  loader: () => import('./Components/RoomPage'),
  loading: PageLoader,
});

export default [
  {
    path: '/room',
    child: [
      {
        path: '/',
        component: () => (<RoomPage />)
      },
    ],
  }
]

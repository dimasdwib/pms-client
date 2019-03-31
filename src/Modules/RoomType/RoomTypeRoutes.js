import React from 'react'; // eslint-disable-line no-unused-vars
import Loadable from 'react-loadable';
import PageLoader from '../../Components/Layout/Admin/PageLoader';

const RoomTypePage = Loadable({
  loader: () => import('./Components/RoomTypePage'),
  loading: PageLoader,
});

export default [
  {
    path: '/roomtype',
    child: [
      {
        path: '/',
        component: () => (<RoomTypePage />)
      },
    ],
  }
]

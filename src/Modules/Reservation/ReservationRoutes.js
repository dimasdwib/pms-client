import React from 'react'; // eslint-disable-line no-unused-vars
import Loadable from 'react-loadable';
import PageLoader from '../../Components/Layout/Admin/PageLoader';

const ReservationPage = Loadable({
  loader: () => import('./Components/ReservationPage'),
  loading: PageLoader,
});

const ReservationForm = Loadable({
  loader: () => import('./Components/Form/ReservationForm'),
  loading: PageLoader,
});

const ReservationDetail = Loadable({
  loader: () => import('./Components/ReservationDetail'),
  loading: PageLoader,
});

const InHouseList = Loadable({
  loader: () => import('./Components/InHouseList'),
  loading: PageLoader,
});

export default [
  {
    path: '/reservation',
    child: [
      {
        path: '/',
        component: () => (<ReservationPage />)
      },
      {
        path: '/inhouse',
        component: () => (<InHouseList />)
      },
      {
        path: '/create',
        component: () => (<ReservationForm />)
      },
      {
        path: '/:id',
        component: (route) => (<ReservationDetail key={route.match.params.id} id={route.match.params.id} />)
      },
    ],
  }
]

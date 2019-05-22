import React from 'react'; // eslint-disable-line no-unused-vars
import Loadable from 'react-loadable';
import PageLoader from '../../Components/Layout/Admin/PageLoader';

const ReportPage = Loadable({
  loader: () => import('./Components/ReportPage'),
  loading: PageLoader,
});

export default [
  {
    path: '/report',
    child: [
      {
        path: '/:id',
        component: (route) => (<ReportPage id={route.match.params.id} />)
      },
    ],
  }
]

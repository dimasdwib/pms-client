import React from 'react'; // eslint-disable-line no-unused-vars
import Loadable from 'react-loadable';
import PageLoader from '../../Components/Layout/Admin/PageLoader';

const SettingPage = Loadable({
  loader: () => import('./Components/SettingPage'),
  loading: PageLoader,
});

export default [
  {
    path: '/setting',
    child: [
      {
        path: '/',
        component: () => (<SettingPage />)
      },
    ],
  }
]

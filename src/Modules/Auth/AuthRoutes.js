import React from 'react'; // eslint-disable-line no-unused-vars
import LoginPage from './Components/LoginPage';

export default [
  {
    path: '/login',
    child: [
      {
        path: '/',
        component: () => <LoginPage />
      },
    ],
  }
]

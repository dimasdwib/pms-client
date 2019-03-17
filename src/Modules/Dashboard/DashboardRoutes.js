import React from 'react'; // eslint-disable-line no-unused-vars

export default [
  {
    path: '/dashboard',
    child: [
      {
        path: '/',
        component: () => (<h1> Dashboard </h1>)
      },
    ],
  }
]

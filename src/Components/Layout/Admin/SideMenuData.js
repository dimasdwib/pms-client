import { AdminRoute } from '../../../Helper/RouteHelper';
import { confirmLogout } from '../../../Helper/AuthHelper';

/**
 * Side Menu Data
 * 
 */

export default [
  {
    label: 'Dashboard',
    id: 'dashboard',
    icon: 'dashboard',
    path: AdminRoute('/dashboard'),
  },
  {
    label: 'Settings',
    id: 'settings',
    icon: 'setting',
    child: [
      {
        label: 'General',
        id: 'general',
        path: AdminRoute('/general'),
      },
      {
        label: 'Profile',
        id: 'profile',
        path: AdminRoute('/profile'),
      },
    ],
  },
  {
    label: 'Access Control',
    id: 'acl',
    icon: 'team',
    child: [
      {
        label: 'User',
        id: 'user',
        path: AdminRoute('/user'),
      },
      {
        label: 'Permission',
        id: 'permission',
        path: AdminRoute('/permission'),
      },
      {
        label: 'Role',
        id: 'role',
        path: AdminRoute('/role'),
      },  
    ]
  },
  {
    label: 'Logout',
    id: 'logout',
    icon: 'logout',
    action: () => {
      confirmLogout();
    },
  },
];
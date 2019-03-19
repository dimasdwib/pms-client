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
    label: 'Frontdesk',
    id: 'frontdesk',
    icon: 'form',
    child: [
      {
        label: 'Reservation',
        id: 'reservation',
        path: AdminRoute('/reservation'),
      },
      {
        label: 'In House',
        id: 'inhouse',
        path: AdminRoute('/inhouse'),
      },
      {
        label: 'Activity',
        id: 'activity',
        path: AdminRoute('/activity'),
      },
    ],
  },
  {
    label: 'Audit',
    id: 'audit',
    icon: 'audit',
    path: AdminRoute('/audit'),
  },
  {
    label: 'Report',
    id: 'report',
    icon: 'file-done',
    path: AdminRoute('/report'),
  },
  {
    label: 'House Keeping',
    id: 'housekeeping',
    icon: 'rest',
    path: AdminRoute('/housekeeping'),
  },
  {
    label: 'Master Data',
    id: 'masterdata',
    icon: 'folder-open',
    child: [
      {
        label: 'Rooms',
        id: 'rooms',
        path: AdminRoute('/room'),
      },
      {
        label: 'Rates',
        id: 'rates',
        path: AdminRoute('/rate'),
      },
      {
        label: 'Guests',
        id: 'guests',
        path: AdminRoute('/guest'),
      },
    ],
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
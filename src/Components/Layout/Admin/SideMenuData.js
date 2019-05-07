import { AdminUrl } from '../../../Helper/RouteHelper';
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
    path: AdminUrl('/dashboard'),
  },
  {
    label: 'Frontdesk',
    id: 'frontdesk',
    icon: 'form',
    child: [
      {
        label: 'Reservation',
        id: 'reservation',
        path: AdminUrl('/reservation'),
      },
      {
        label: 'In House',
        id: 'inhouse',
        path: AdminUrl('/reservation/inhouse'),
      },
      // {
      //   label: 'Folio',
      //   id: 'folio',
      //   path: AdminUrl('/folio'),
      // },
      // {
      //   label: 'Activity',
      //   id: 'activity',
      //   path: AdminUrl('/activity'),
      // },
    ],
  },
  // {
  //   label: 'Audit',
  //   id: 'audit',
  //   icon: 'audit',
  //   path: AdminUrl('/audit'),
  // },
  {
    label: 'Report',
    id: 'report',
    icon: 'file-done',
    path: AdminUrl('/report/main'),
  },
  {
    label: 'House Keeping',
    id: 'housekeeping',
    icon: 'rest',
    path: AdminUrl('/housekeeping'),
  },
  {
    label: 'Master Data',
    id: 'masterdata',
    icon: 'folder-open',
    child: [
      {
        label: 'Bed',
        id: 'beds',
        path: AdminUrl('/bed'),
      },
      {
        label: 'Rooms',
        id: 'rooms',
        path: AdminUrl('/room'),
      },
      {
        label: 'Room Type',
        id: 'roomtypes',
        path: AdminUrl('/roomtype'),
      },
      {
        label: 'Rates',
        id: 'rates',
        path: AdminUrl('/rate'),
      },
      {
        label: 'Guests',
        id: 'guests',
        path: AdminUrl('/guest'),
      },
    ],
  },
  // {
  //   label: 'Settings',
  //   id: 'settings',
  //   icon: 'setting',
  //   child: [
  //     {
  //       label: 'Setting',
  //       id: 'setting',
  //       path: AdminUrl('/setting'),
  //     },
  //     {
  //       label: 'Profile',
  //       id: 'profile',
  //       path: AdminUrl('/profile'),
  //     },
  //   ],
  // },
  {
    label: 'Access Control',
    id: 'acl',
    icon: 'team',
    child: [
      {
        label: 'User',
        id: 'user',
        path: AdminUrl('/user'),
      },
      {
        label: 'Permission',
        id: 'permission',
        path: AdminUrl('/permission'),
        permission: 'view-room-status'
      },
      {
        label: 'Role',
        id: 'role',
        path: AdminUrl('/role'),
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
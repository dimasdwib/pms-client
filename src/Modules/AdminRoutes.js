import React from 'react'; // eslint-disable-line no-unused-vars
import { AdminRoute } from '../Helper/RouteHelper';
import AdminLayout from '../Components/Layout/Admin/AdminLayout';
import UserRoutes from './User/UserRoutes';
import PermissionRoutes from './Permission/PermissionRoutes';
import DashboardRoutes from './Dashboard/DashboardRoutes';
import RoleRoutes from './Role/RoleRoutes';
import GuestRoutes from './Guest/GuestRoutes';

export default [
  {
    path: AdminRoute(''),
    component: (props) => {
      return (<AdminLayout match={props.match}> {props.child} </AdminLayout>)
    },
    child: [
      ...DashboardRoutes,
      ...UserRoutes,
      ...PermissionRoutes,
      ...RoleRoutes,
      ...GuestRoutes,
    ],
  },
]

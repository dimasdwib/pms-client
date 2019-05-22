import React from 'react'; // eslint-disable-line no-unused-vars
import { AdminUrl } from '../Helper/RouteHelper';
import AdminLayout from '../Components/Layout/Admin/AdminLayout';
import UserRoutes from './User/UserRoutes';
import PermissionRoutes from './Permission/PermissionRoutes';
import DashboardRoutes from './Dashboard/DashboardRoutes';
import RoleRoutes from './Role/RoleRoutes';
import GuestRoutes from './Guest/GuestRoutes';
import BedRoutes from './Bed/BedRoutes';
import RoomRoutes from './Room/RoomRoutes';
import RateRoutes from './Rate/RateRoutes';
import ReservationRoutes from './Reservation/ReservationRoutes';
import HouseKeepingRoutes from './HouseKeeping/HouseKeepingRoutes';
import ReportRoutes from './Report/ReportRoutes';
import AuditRoutes from './Audit/AuditRoutes';
import SettingRoutes from './Setting/SettingRoutes';
import RoomTypeRoutes from './RoomType/RoomTypeRoutes';
import floorRoutes from './Floor/FloorRoutes';

export default [
  {
    path: AdminUrl(''),
    component: (props) => {
      return (<AdminLayout match={props.match}> {props.child} </AdminLayout>)
    },
    child: [
      ...DashboardRoutes,
      ...UserRoutes,
      ...PermissionRoutes,
      ...RoleRoutes,
      ...GuestRoutes,
      ...BedRoutes,
      ...RoomRoutes,
      ...RoomTypeRoutes,
      ...RateRoutes,
      ...ReservationRoutes,
      ...HouseKeepingRoutes,
      ...ReportRoutes,
      ...AuditRoutes,
      ...SettingRoutes,
      ...FloorRoutes,
    ],
  },
]

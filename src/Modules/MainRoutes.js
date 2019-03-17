import React from 'react'; // eslint-disable-line no-unused-vars
import { MapRoutes } from '../Helper/RouteHelper';
import AdminRoutes from './AdminRoutes';
import AuthRoutes from './Auth/AuthRoutes';

/**
 * Register all routes
 * 
 */
const MAIN_ROUTES = [
  ...AuthRoutes,
  ...AdminRoutes,
];

const Routes = MapRoutes(MAIN_ROUTES);
export default Routes;

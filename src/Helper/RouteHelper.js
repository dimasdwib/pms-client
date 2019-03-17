import React from 'react'; // eslint-disable-line no-unused-vars
import { Route, Switch } from 'react-router-dom';
import NotFound from '../Components/Layout/NotFound';

export function AdminRoute(route) {
  const prefix = '/administrator';
  return `${prefix}${route}`;
}

export function AdminUrl(route) {
  const prefix = '/administrator';
  return `${prefix}${route}`;
}

export function MapRoutes(routes, parent) {
  const res = [];
  routes.forEach((r, i) => {
    let path = r.path;
    let exact = r.path === '/';
    if (parent) {
      path = `${parent}${r.path}`;
    }
    if (r.child) {
      const child = MapRoutes(r.child, path);
      if (r.component) {
        res.push(<Route key={i} exact={exact} path={path} component={(match) => <r.component match={match} child={<Switch>{child}</Switch>} />} />);        
      } else {
        res.push(<Route key={i} exact={exact} path={path} render={(match) => <Switch>{child}</Switch>} />);        
      }
    } else if (r.component) {
      res.push(<Route key={i} exact path={path} component={r.component} />);
    }
  });
  res.push(<Route key={`${parent}-notFound`} path={`${parent}/*`} exact component={NotFound} />);
  return res;
}
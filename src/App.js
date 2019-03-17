import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MainRoutes from './Modules/MainRoutes';
import NotFound from './Components/Layout/NotFound';
import './App.css';

const App = () => (
  <Switch>
    { MainRoutes }
    <Route path="*" exact component={NotFound} />
  </Switch>
);

export default App;

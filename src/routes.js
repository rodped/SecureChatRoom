import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { isAuthenticated } from "./services/auth";

import User from "./pages/Chat/User";
import ChangePassword from "./pages/Chat/User/ChangePassword";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ChatUser from "./pages/Chat/User/ChatLoginUser";
import ChatAdmin from "./pages/Chat/Admin/ChatLoginAdmin";
import Admin from "./pages/Chat/Admin";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
    }
  />
);

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={SignIn} />
      <PrivateRoute path="/user" component={User} />
      <PrivateRoute path="/chat" component={ChatUser} />
      <PrivateRoute path="/changePassword" component={ChangePassword} />

      <PrivateRoute path="/admin" component={Admin} />
      <PrivateRoute path="/signup" component={SignUp} />
      <PrivateRoute path="/chatAdmin" component={ChatAdmin} />

      <Route path="*" >
        <Redirect to={{ pathname: "/" }} />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default Routes;
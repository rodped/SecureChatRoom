import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { isAuthenticated, /*getRole*/ } from "./services/auth";

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

// const AdminRoute = ({ component: Component, ...rest }) => (
//   <Route
//     {...rest}
//     render={props =>
//       (isAuthenticated && getRole === "ADMIN") ? (
//         <Component {...props} />
//       ) : (
//           <Redirect to={{ pathname: "/", state: { from: props.location } }} />
//         )
//     }
//   />
// );

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={SignIn} />
      <PrivateRoute path="/chat" component={ChatUser} />

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
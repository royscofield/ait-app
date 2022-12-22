import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Route,
  Routes,
  Switch,
  Redirect,
} from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "styles/tailwind.css";
import Index from "pages";
import Register from "pages/auth/register";
import AuthProvider from "./context/AuthContext";
import Login from "pages/auth/login";
import EventDetail from "pages/_eventdetail";
import EventRewardRegister from "pages/_registergift";
import EventRegister from "pages/_joinevent";
import Setting from "pages/auth/setting"
import ForgotPassword from "pages/auth/forgot-password";

ReactDOM.render(
  <AuthProvider>
    <Routes>
      <Route path="auth/login" element={<Login />} />
      <Route path="auth/register" element={<Register />} />
      <Route path="auth/forgot-password" element={<ForgotPassword />} />
      <Route path="auth/setting" element={<Setting />} />
    </Routes>
  </AuthProvider>,
  <BrowserRouter>
    <Switch>
      <Route path="/auth/login" exact component={Login} />
      <Route path="/auth/register" exact component={Register} />
      <Route path="/" exact component={Index} />
      <Route path="/_registergift" exact component={EventRewardRegister} />
      <Route path="/_joinevent" exact component={EventRegister} />
      <Route path="/_eventdetail" exact component={EventDetail} />
      <Route path="/auth/setting" exact component={Setting} />
      <Route path="/auth/forgot-password" exact component={ForgotPassword} />
      <Redirect from="*" to="/" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);

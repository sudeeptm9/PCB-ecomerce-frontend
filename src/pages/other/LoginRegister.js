import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import MetaTags from "react-meta-tags";
// import { Link } from "react-router-dom";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import axios from "axios";
import Cookies from "universal-cookie";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { useContext } from "react";
import { UserContext } from "../../App";

const LoginRegister = ({ location }) => {
  let history = useHistory();
  let { addToast } = useToasts();
  const { pathname } = location;
  const cookies = new Cookies();
  let [email, setEmail] = useState();
  let [password, setPassword] = useState();
  let [confirmPassword, setConfirmPassword] = useState();
  let [username, setUsername] = useState();

  let user = useContext(UserContext);

  const Login = async () => {
    let response = await axios.post(`http://localhost:8080/user/login`, {
      email: email,
      passwords: password,
    });
    if (response.status === 200) {
      cookies.set("Authorization", response.data.token, {
        path: "/",
        SameSite: "None",
      });
      cookies.set("Email", email, { path: "/", SameSite: "None" });
      addToast("Login Successfully", { appearance: "success" });
      user.setUser({ email: email });
      history.goBack();
    } else {
      addToast("Email or Password incorrect", { appearance: "error" });
    }
  };
  const Register = async () => {
    console.log(password, confirmPassword);
    if (password === confirmPassword) {
      console.log(password)
      let response = await axios.post(`http://localhost:8080/user/register`, {
        username: username,
        email: email,
        passwords: password,
      });
      if (response.status === 200) {
        addToast("Regsitered successfully", { appearance: "success" });
        // Login();
      } else {
        addToast("Regsiteration failed as email already exists", {
          appearance: "error",
        });
      }
    } else {
      addToast("Password and Confirm Password not matching", {
        appearance: "error",
      });
    }
  };
  return (
    <Fragment>
      <MetaTags>
        <title>ProPCB | Login</title>
        <meta name="description" content="Login" />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Login Register
      </BreadcrumbsItem>
      <LayoutOne>
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ml-auto mr-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>Login</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="register">
                          <h4>Register</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form>
                              <input
                                type="email"
                                name="user-email"
                                placeholder="Email"
                                onChange={(e) => {
                                  e.preventDefault();
                                  setEmail(e.target.value);
                                }}
                              />
                              <input
                                type="password"
                                name="user-password"
                                placeholder="Password"
                                onChange={(e) => {
                                  e.preventDefault();
                                  setPassword(e.target.value);
                                }}
                              />
                              <div className="button-box">
                                {/* <div className="login-toggle-btn">
                                  <input type="checkbox" />
                                  <label className="ml-10">Remember me</label>
                                  <Link to={process.env.PUBLIC_URL + "/"}>
                                    Forgot Password?
                                  </Link>
                                </div> */}
                                <button
                                  type="submit"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    Login();
                                  }}
                                >
                                  <span>Login</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form>
                              <input
                                type="text"
                                name="user-name"
                                placeholder="Username"
                                onChange={(e) => {
                                  e.preventDefault();
                                  setUsername(e.target.value);
                                }}
                              />
                              <input
                                name="user-email"
                                placeholder="Email"
                                type="email"
                                onChange={(e) => {
                                  e.preventDefault();
                                  setEmail(e.target.value);
                                }}
                              />
                              <input
                                type="password"
                                name="user-password"
                                placeholder="Password"
                                onChange={(e) => {
                                  e.preventDefault();
                                  setPassword(e.target.value);
                                }}
                              />
                              <input
                                type="password"
                                name="confirm-user-password"
                                placeholder="Confirm Password"
                                onChange={(e) => {
                                  e.preventDefault();
                                  setConfirmPassword(e.target.value);
                                }}
                              />
                              <div className="button-box">
                                <button
                                  type="submit"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    Register();
                                  }}
                                >
                                  <span>Register</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

LoginRegister.propTypes = {
  location: PropTypes.object,
};

export default LoginRegister;

import React, { Component } from "react";
import { Link, withRouter, Redirect } from "react-router-dom";

import Logo from "../../assets/MyChat.svg";

import api from "../../services/api";
import { logout, getRole } from "../../services/auth";

import { Form, Container } from "./styles";

class SignUp extends Component {
  state = {
    username: "",
    email: "",
    roles: "",
    password: "",
    error: "",
    currentRole: null
  };

  async componentDidMount() {
    const role = await getRole()
    this.setState({ currentRole: role })
  }

  handleSignUp = async e => {
    e.preventDefault();
    const obj = {
      username: this.state.username,
      email: this.state.email,
      roles: [this.state.roles],
      password: this.state.password
    };
    const { username, email, password } = this.state;
    if (!username || !email || !password) {
      this.setState({ error: "Fill in all the data to register" });
    } else {
      try {
        const numUsers = await api.post("http://localhost:8080/api/users");
        if (numUsers.data.numUsers === 0) {
          obj.roles = ["admin"];
          await api.post("http://localhost:8080/api/auth/signup", obj);
          await api.post("http://localhost:8080/api/chatkit/user", obj);
          this.props.history.push("/");
        } else {
          await api.post("http://localhost:8080/api/auth/signup", obj);
          await api.post("http://localhost:8080/api/chatkit/user", obj);
          this.props.history.push("/");
        }
      } catch (err) {
        console.log(err);
        this.setState({ error: "There was an error registering your account" });
      }
    }
    logout();
  };

  nextPath(path) {
    this.props.history.push(path);
  }

  render() {
    if (!this.state.currentRole) {
      return <div>Loading...</div>
    }
    if (this.state.currentRole.toString() === "ADMIN") {
      return (
        <Container>
          <Form onSubmit={this.handleSignUp}>
            <img src={Logo} alt="MyChat" />
            {this.state.error && <p>{this.state.error}</p>}
            <input
              type="text"
              placeholder="Username"
              onChange={e => this.setState({ username: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              onChange={e => this.setState({ email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={e => this.setState({ password: e.target.value })}
            />
            <div>
              <div>
                <label className="radio">Admin</label>
                <input
                  type="radio"
                  name="radio"
                  value="admin"
                  className="k-radio"
                  onChange={e => this.setState({ roles: e.target.value })}
                />
              </div>

              <div>
                <label className="radio">User</label>
                <input
                  type="radio"
                  name="radio"
                  value="user"
                  className="k-radio"
                  onChange={e => this.setState({ roles: e.target.value })}
                />
              </div>
            </div>
            <button type="submit">Sign Up</button>
            <hr />
            <Link to="/admin">Admin</Link>
          </Form>
        </Container>
      );
    }
    return (
      <Redirect to={{ pathname: "/" }} />
    )
  }
}

export default withRouter(SignUp);

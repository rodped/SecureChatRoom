import React, { Component } from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import randomize from "randomatic";
import bcrypt from "bcryptjs";

import Logo from "../../assets/MyChat.svg";

import api from "../../services/api";
import { logout, getRole } from "../../services/auth";

import { Form, Container } from "./styles";

var key = 'real secret keys should be long and random';
var encryptor = require('simple-encryptor')(key);

var passwordEncrypt

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

  async generatePassword() {
    const password = randomize('*', 10);
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    passwordEncrypt = encryptor.encrypt(password)
    this.setState({ password: hash.toString() });
  }

  handleSignUp = async e => {
    e.preventDefault();
    await this.generatePassword();
    const obj = {
      username: this.state.username,
      email: this.state.email,
      roles: [this.state.roles],
      password: this.state.password,
      passwordEncrypt: passwordEncrypt
    };
    const { username, email } = this.state;
    if (!username || !email) {
      this.setState({ error: "Fill in all the data to register" });
    } else {
      try {
        const numUsers = await api.post("https://localhost:8080/api/users");
        if (numUsers.data.numUsers === 0) {
          obj.roles = ["admin"];
          await api.post("https://localhost:8080/api/auth/signup", obj);
          await api.post("https://localhost:8080/api/chatkit/user", obj);
          this.props.history.push("/");
        } else {
          await api.post("https://localhost:8080/api/auth/signup", obj);
          await api.post("https://localhost:8080/api/chatkit/user", obj);
          await api.post("https://localhost:8080/api/sendMail", obj);
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

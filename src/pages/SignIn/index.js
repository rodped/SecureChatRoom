import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import Logo from "../../assets/MyChat.svg";
import api from "../../services/api";
import { login, getRole } from "../../services/auth";

import { Form, Container } from "./styles";

var key = 'real secret keys should be long and random';
var encryptor = require('simple-encryptor')(key);

class SignIn extends Component {
  state = {
    email: "",
    password: "",
    error: ""
  };

  async componentDidMount() {
    const numUsers = await api.post("https://localhost:8080/api/users");
    if (numUsers.data.numUsers === 0) {
      const obj = {
        "username": "admin",
        "email": "admin@mail.com",
        "roles": [
          "admin"
        ],
        "password": "admin"
      };
      await api.post("https://localhost:8080/api/auth/signup", obj);
    }
  }

  handleSignIn = async e => {
    e.preventDefault();
    const obj = {
      email: this.state.email,
      password: this.state.password
    };
    const { email, password } = this.state;
    if (!email || !password) {
      this.setState({ error: "Fill in your email and password to continue" });
    } else {
      try {
        const response = await api.post("https://localhost:8080/api/auth/signin", obj);
        login(response.data.accessToken);
        const role = await getRole();
        if (role === "ADMIN") this.props.history.push("/admin");
        else if (role === "USER") this.props.history.push("/user");
      } catch (err) {
        this.setState({
          error:
            "There was a problem signing in, check your credentials"
        });
      }
    }
  };

  render() {
    return (
      <Container>
        <Form onSubmit={this.handleSignIn}>
          <img src={Logo} alt="MyChat" />
          {this.state.error && <p>{this.state.error}</p>}
          <input
            type="email"
            placeholder="Email"
            onChange={e => this.setState({ email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={e => this.setState({ password: encryptor.encrypt(e.target.value) })}
          />
          <button type="submit">Sign In</button>
        </Form>
      </Container>
    );
  }

}

export default withRouter(SignIn);

import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import Logo from "../../assets/MyChat.svg";
import api from "../../services/api";
import { login } from "../../services/auth";

import { Form, Container } from "./styles";

class SignIn extends Component {
  state = {
    email: "",
    password: "",
    error: ""
  };

  async componentDidMount() {
    const numUsers = await api.post("http://localhost:8080/api/users");
    if (numUsers.data.numUsers === 0) {
      const obj = {
        "username": "admin",
        "email": "admin@mail.com",
        "roles": [
          "admin"
        ],
        "password": "admin"
      };
      await api.post("http://localhost:8080/api/auth/signup", obj);
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
        const response = await api.post("http://localhost:8080/api/auth/signin", obj);
        login(response.data.accessToken);
        this.props.history.push("/chat");
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
            onChange={e => this.setState({ password: e.target.value })}
          />
          <button type="submit">Sign In</button>
        </Form>
      </Container>
    );
  }

}

export default withRouter(SignIn);

import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { logout } from "../../../services/auth";

import Logo from "../../../assets/MyChat.svg";

import { Form, Container } from "../styles";

class User extends Component {

    nextPath(path) {
        this.props.history.push(path);
    }

    render() {
        return (
            <Container>
                <Form>
                    <img src={Logo} alt="MyChat" />
                    <Link to="/chat">Chat</Link>
                    <hr />
                    <Link to="/changePassword">Change Password</Link>
                    <hr />
                    <Link to="/" onClick={() => logout()}>Sign Out</Link>
                </Form>
            </Container>
        )
    }
}

export default withRouter(User);

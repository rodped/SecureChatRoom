import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import Logo from "../../../assets/MyChat.svg";

import { Form, Container } from "../styles";

class Admin extends Component {

    nextPath(path) {
        this.props.history.push(path);
    }

    render() {
        return (
            <Container>
                <Form>
                <img src={Logo} alt="MyChat" />
                <Link to="/chatAdmin">Chat</Link>
                <hr/>
                <Link to="/signup">Sign Up</Link>
                </Form>
            </Container>
        );
    }

}

export default withRouter(Admin);

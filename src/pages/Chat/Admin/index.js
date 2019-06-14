import React, { Component } from "react";
import { Link, withRouter, Redirect } from "react-router-dom";

import { getRole } from "../../../services/auth";

import Logo from "../../../assets/MyChat.svg";

import { Form, Container } from "../styles";

class Admin extends Component {
    constructor() {
        super()
        this.state = {
            currentRole: null
        }
    }

    async componentDidMount() {
        const role = await getRole()
        this.setState({ currentRole: role })
    }

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
                    <Form>
                        <img src={Logo} alt="MyChat" />
                        <Link to="/chatAdmin">Chat</Link>
                        <hr />
                        <Link to="/signup">Sign Up</Link>
                    </Form>
                </Container>
            )
        }
        return (
            <Redirect to={{ pathname: "/" }} />
        )
    }
}

export default withRouter(Admin);

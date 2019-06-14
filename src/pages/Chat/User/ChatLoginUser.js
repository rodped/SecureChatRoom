import React, { Component } from 'react'
import { Link, withRouter } from "react-router-dom"

import { Form, Container } from "../styles";
import ChatScreenUser from './ChatScreenUser'
import Logo from "../../../assets/MyChat.svg";

import { getUsername, getRole } from '../../../services/auth'

class ChatLoginUser extends Component {
    constructor() {
        super()
        this.state = {
            currentUsername: null,
            role: null
        }
    }

    async componentDidMount() {
        const username = await getUsername()
        const r = await getRole()
        this.setState({ currentUsername: username, role: r })
    }

    getRole() {
        return this.state.role;
    }

    render() {
        if (!this.state.currentUsername || !this.state.role) {
            return <div>Loading...</div>
        }
        if (this.state.role.toString() === 'ADMIN') {
            return (<Container>
                <Form>
                    <img src={Logo} alt="MyChat" />
                    <Link to="/chatAdmin">Chat</Link>
                    <hr />
                    <Link to="/signup">Sign Up</Link>
                </Form>
            </Container>)

        }
        return <ChatScreenUser currentUsername={this.state.currentUsername} />

    }
}

export default withRouter(ChatLoginUser)

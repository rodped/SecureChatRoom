import React, { Component } from 'react'
import { withRouter, Redirect } from "react-router-dom"

import ChatScreenAdmin from './ChatScreenAdmin'

import { getUsername, getRole } from "../../../services/auth";

class ChatLoginAdmin extends Component {
    constructor() {
        super()
        this.state = {
            currentUsername: null,
            currentRole: null
        }
    }

    async componentDidMount() {
        const username = await getUsername()
        const role = await getRole()
        this.setState({ currentUsername: username })
        this.setState({ currentRole: role })
    }

    render() {
        if (!this.state.currentUsername || !this.state.currentRole) {
            return <div>Loading...</div>
        }
        if (this.state.currentRole.toString() === "ADMIN") {
            return <ChatScreenAdmin currentUsername={this.state.currentUsername} />
        }
        return (
            <Redirect to={{ pathname: "/" }} />
        )
    }
}

export default withRouter(ChatLoginAdmin)

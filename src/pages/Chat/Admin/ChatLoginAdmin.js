import React, { Component } from 'react'
import { withRouter } from "react-router-dom"

import ChatScreenAdmin from './ChatScreenAdmin'

import { getUsername } from "../../../services/auth";

class ChatLoginAdmin extends Component {
    constructor() {
        super()
        this.state = {
            currentUsername: null
        }
    }

    async componentDidMount() {
        const username = await getUsername()
        this.setState({ currentUsername: username })
    }

    render() {
        if (!this.state.currentUsername) {
            return <div>Loading...</div>
        }
        return <ChatScreenAdmin currentUsername={this.state.currentUsername} />
    }
}

export default withRouter(ChatLoginAdmin)

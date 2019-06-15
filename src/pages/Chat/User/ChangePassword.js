import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import bcrypt from "bcryptjs";

import Logo from "../../../assets/MyChat.svg";
import api from "../../../services/api";
import { getEmail } from "../../../services/auth";

import { Form, Container } from "./../styles";

var key = 'real secret keys should be long and random';
var encryptor = require('simple-encryptor')(key);

class ChangePassword extends Component {
    state = {
        email: "",
        oldpassword: "",
        newpassword: "",
        error: ""
    };

    async componentDidMount() {
        const email = await getEmail()
        this.setState({ email: email })
    }

    async generateHash() {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(this.state.newpassword, salt);
        this.setState({ newpassword: hash.toString() });
    }

    handleSignIn = async e => {
        e.preventDefault();
        await this.generateHash();
        const obj = {
            email: this.state.email,
            oldpassword: this.state.oldpassword,
            newpassword: this.state.newpassword
        };
        const { oldpassword, newpassword } = this.state;
        if (!oldpassword || !newpassword) {
            this.setState({ error: "Fill all data to continue" });
        } else {
            try {
                await api.put("http://localhost:8080/api/user/changePassword", obj);
                this.props.history.push("/user");
            } catch (err) {
                this.setState({
                    error:
                        "There was a problem to change your password"
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
                        type="password"
                        placeholder="Old Password"
                        onChange={e => this.setState({ oldpassword: encryptor.encrypt(e.target.value) })}
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        onChange={e => this.setState({ newpassword: e.target.value })}
                    />
                    <button type="submit">Change Password</button>
                </Form>
            </Container>
        );
    }

}

export default withRouter(ChangePassword);

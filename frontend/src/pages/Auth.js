import React, { Component } from 'react';

import FetchApi from '../service/service';
import AuthContext from '../context/auth-context';

import './Auth.css';

class AuthPage extends Component {

    static contextType = AuthContext;

    state = {
        isLogin: true
    }

    isActive = true;

    constructor(props) {
        super(props);
        // create ref for easy access
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchModeHandler = () => {
      this.setState( prevState => {
          return { isLogin: !prevState.isLogin }
      });
    }

    // if we declare this way then we don't need to bind
    submitHandler = (ev) => {
        ev.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        if (!email.trim().length || !password.trim().length) {
            return;
        }

        let requestBody = {
            query: `
              query loginUser($email: String!, $password: String!) {
                  login(email: $email, password: $password) {
                      userId
                      token
                      tokenExpiration
                  }
              }
            `,
            variables: {
              email: email,
              password: password
            }
        };

        if (!this.state.isLogin) {
            requestBody = { 
              query: `
                mutation createUser($email: String!, $password: String!) {
                    createUser(myUserInput: {email: $email, password: $password}) {
                        _id
                        email
                    }
                }
              `,
              variables: {
                email: email,
                password: password
              }
            }
        }

        FetchApi(
          requestBody, 
          null, 
          res => {
            if (this.state.isLogin) {
                const { token, tokenExpiration, userId } = res.data.login;
                this.context.login(userId, token, tokenExpiration);
            } else {
                console.log(res.data.createUser);
            }
          },
        );
    };

    render () {
        return (
            <form className="auth-form" onSubmit={this.submitHandler}>
                <div className="form-control">
                    <label htmlFor="email"> E-Mail </label>
                    <input type="email" id="email" ref={this.emailEl} />
                </div>
                <div className="form-control">
                    <label htmlFor="password"> Password </label>
                    <input type="password" id="password" ref={this.passwordEl} />
                </div>
                <div className="form-actions">
                    <button type="submit"> Submit </button>
                    <button type="button" onClick={this.switchModeHandler}> Switch to { this.state.isLogin ? "Signup" : "Login" } </button>
                </div>

            </form>
        );
    }
}

export default AuthPage;

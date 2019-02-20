import React, { Component } from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

import './App.css';

class App extends Component {

    state = {
        token: null,
        userId: null,

    }

    login = (userId, token, tokenExpiration) => {
        this.setState({token, userId});
    }

    logout = () => {
        this.setState({ userId: null, token: null })
    }

    render() {

        const contextValues = {
            token: this.state.token,
            tokenExpiration: null,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout
        };

        // we can make conditions for routes too, depend on our state (user logged or not logged)
        // we place last route a default if not have token the current user
        return (
            <BrowserRouter className="App">
                <AuthContext.Provider value={contextValues}>
                    <MainNavigation />
                    <main className="main-content">
                        <Switch>
                            { this.state.token && (<Redirect from="/" to="/events" exact />) }
                            { this.state.token && (<Redirect from="/auth" to="/events" exact />) }
                            { this.state.token && (<Route exact path="/bookings" component={BookingsPage} />) }
                            <Route exact path="/events" component={EventsPage} />
                            { !this.state.token && (<Redirect from="/" to="/auth" exact />) }
                            { !this.state.token && (<Route exact path="/auth" component={AuthPage} />) }
                        </Switch>
                    </main>
                </AuthContext.Provider>
            </BrowserRouter>
        );
    }
}

export default App;

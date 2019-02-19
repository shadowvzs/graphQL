import React, { Component } from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';

import './App.css';

class App extends Component {
    render() {
        return (
            <BrowserRouter className="App">
                <>
                    <MainNavigation />
                    <main className="main-content">
                        <Switch>
                            <Redirect from="/" to="/auth" exact />
                            <Route exact path="/auth" component={AuthPage} />
                            <Route exact path="/events" component={EventsPage} />
                            <Route exact path="/bookings" component={BookingsPage} />
                        </Switch>
                    </main>
                </>
            </BrowserRouter>
        );
    }
}

export default App;

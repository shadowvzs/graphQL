import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';

import './MainNavigation.css';

// we use context consumer child function for make context accessable
// this good for functional component

// also we use shortcircuit for show/hide links depend on context token

const mainNavigation = props => (
    <AuthContext.Consumer>
        { (context) => {
            return (
                <header className="main-navigation">
                    <div className="main-navigation__logo">
                        <h1> Nav </h1>
                    </div>
                    <div className="main-navigation__items">
                        <ul>
                            { !context.token && (
                                <li>
                                    <NavLink to="/auth"> Authenticate </NavLink>
                                </li>)
                            }
                            <li>
                                <NavLink to="/events"> Events </NavLink>
                            </li>
                            { context.token && (
                                  <li>
                                      <NavLink to="/bookings"> Bookings </NavLink>
                                  </li>)
                            }
                        </ul>
                    </div>
                </header>
            );
        }}
    </AuthContext.Consumer>
);


export default mainNavigation;

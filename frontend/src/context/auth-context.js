import React from 'react';

// default values in context like a blueprint/interface for us

export default React.createContext({
    token: null,
    userId: null,
    login: (userId, token, tokenExpiration) => {},
    logout: () => {}
});

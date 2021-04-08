import React, { createContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';

const INITIAL_STATE = {
    user: null
}

if(localStorage.getItem('jwtToken')) {
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));

    if(decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('jwtToken');
    }else {
        INITIAL_STATE.user = decodedToken;
    }
}

const AuthContext = createContext({
    user: null, 
    login: (data) => {},
    logout: () => {}
});

function authReducer(state, action) {
    switch(action.type) {
        case 'LOGIN': 
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null
            }
        default :
            return state
    }
}

function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

    const login = userData => {
        localStorage.setItem('jwtToken', userData.token);
        dispatch({
            type: 'LOGIN',
            payload: userData
        });
    }

    const logout = () => {
        localStorage.removeItem('jwtToken');
        dispatch({
            type: 'LOGOUT'
        });
    }

    return (
        <AuthContext.Provider 
            value={{ user: state.user, login, logout }}
            {...props}
        />
    )

}

export {
    AuthProvider,
    AuthContext
}
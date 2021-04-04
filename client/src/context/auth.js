import React, { createContext, useReducer } from 'react';

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

const INITIAL_STATE = {
    user: null
}

function AuthProvider(props) {
    const [state, dispatch] = useReducer(authReducer, INITIAL_STATE);

    const login = userData => {
        dispatch({
            type: 'LOGIN',
            payload: userData
        })
    }

    const logout = () => {
        dispatch({
            type: 'LOGOUT'
        })
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
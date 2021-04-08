import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import { AuthContext } from '../../context/auth';
import { LOGIN_USER } from "../../graphql/gql";

import { Button, Form } from 'semantic-ui-react';

const Login = () => {
    const history = useHistory();
    const { login } = useContext(AuthContext);

    const [errors, setErrors] = useState([])
    const [info, setInfo] = useState({
        username: '',
        password: '',
    })

    const handleChange = e => {
        const { name, value } = e.target;
        setInfo({
            ...info,
            [name] : value
        })
        setErrors([])
    }

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, { data : { login: user }} ) {
            login(user);
            history.push('/');
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors)
        },
        variables: info
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser()
    }

    return (
        <div className="form-container login">
            <h2>Login</h2>
            <Form onSubmit={handleSubmit} noValidate className={loading ? 'loading' : ''} >
                <Form.Input 
                    type='text'
                    label='Username'
                    placeholder='username'
                    name='username'
                    value={info.username}
                    onChange={handleChange}
                    error={errors.username ? true : false}
                />
                <Form.Input 
                    type='password'
                    label='Password'
                    placeholder='password'
                    name='password'
                    value={info.password}
                    onChange={handleChange}
                    error={errors.password ? true : false}
                />

                <Button type='submit' primary>
                    Login
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className='ui error message'>
                <ul className='ui list'>
                {
                    Object.values(errors).map(value => (
                        <li key={value}>
                            {value}
                        </li>
                    ))
                }
                </ul>
            </div>
            )}
        </div>
    )
}

export default Login;
import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import { AuthContext } from '../../context/auth';
import { REGISTER_USER } from "../../graphql/gql";

import { Button, Form } from 'semantic-ui-react';

import './styles.css'

const Register = () => {
    const history = useHistory();
    const { login } = useContext(AuthContext);

    const [errors, setErrors] = useState([])
    const [info, setInfo] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = e => {
        const { name, value } = e.target;
        setInfo({
            ...info,
            [name] : value
        })
        setErrors([])
    }

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, { data: { register: user } }) {
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
        addUser();
    }

    return (
        <div className="form-container register">
            <h2>Register</h2>
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
                    type='email'
                    label='Email'
                    placeholder='email'
                    name='email'
                    value={info.email}
                    onChange={handleChange}
                    error={errors.email ? true : false}
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
                <Form.Input 
                    type='password'
                    label='ConfirmPassword'
                    placeholder='confirmPassword'
                    name='confirmPassword'
                    value={info.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword ? true : false}
                />

                <Button type='submit' primary>
                    Submit
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

export default Register;
import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { FETCH_POSTS_QUERY, CREATE_POST_MUTATION } from "../graphql/gql";

import { Form, Button } from 'semantic-ui-react';

const PostForm = ({ setOpenPopup }) => {
    const [body, setBody] = useState('');

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        update(proxy, { data: { createPost: post} }) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY, 
                data: {
                    getPosts: [post, ...data.getPosts]
                }
            })

            setBody('');
            setOpenPopup(false);
        },
        variables: { body }
    })

    const handleSubmit = () => {
        createPost();
    }

    return (
        <>
        <Form onSubmit={handleSubmit}>
            <h3>Create a Post</h3>
            <Form.Field>
                <Form.Input
                    placeholder="you wanna say something ?"
                    name="body"
                    onChange={(e) => setBody(e.target.value)}
                    value={body}
                    size='large'
                    error={error ? true : false}
                />
                <Button type='submit' color='facebook'>
                    Submit
                </Button>
            </Form.Field>
        </Form>
        {error && (
            <div className='ui error message' style={{
                padding: '10px',
                fontSize: '16px'
            }}>
                <ul className='ui list'>
                    <li>
                        {error.graphQLErrors[0].message}
                    </li>
                </ul>
            </div>
        )}
        </>
    )
}
export default PostForm;
import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { DELETE_POST_MUTATION, FETCH_POSTS_QUERY } from '../graphql/gql';

import { Button, Confirm } from 'semantic-ui-react';


const Delete = ({ postId, callback }) => {
    const[confirmOpen, setConfirmOpen] = useState(false);

    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        variables: { postId },

        update(proxy) {
            setConfirmOpen(false);
        
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            const updatedPosts = data.getPosts.filter(post => post.id !== postId);
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    getPosts: updatedPosts
                }
            })
            if(callback) callback();
        },

        onError(err) {
            // console.log(err);
        }
    })

    return (
        <>
            <Button
                as='div'
                color='red'
                icon='trash'
                floated='right'
                onClick={() => setConfirmOpen(true)}
            />
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={() => deletePost()}
            />
        </>
    )
}
export default Delete;
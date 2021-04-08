import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { DELETE_POST_MUTATION, FETCH_POSTS_QUERY, DELETE_COMMENT_MUTATION } from '../graphql/gql';

import { Button, Confirm, Popup } from 'semantic-ui-react';


const Delete = ({ postId, callback, commentId }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrComment] = useMutation(mutation, {
        variables: { postId, commentId },

        update(proxy) {
            setConfirmOpen(false);

            if (!commentId) {
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
            }
            if (callback) callback();
        },

        onError(err) {
            // console.log(err);
        }
    })

    return (
        <>
            <Popup
                trigger={
                    <Button
                        as='div'
                        color='red'
                        icon='trash'
                        floated='right'
                        onClick={() => setConfirmOpen(true)}
                    />
                }
                content='delete'
                inverted
                on='hover'
                position='top center'
            />
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={() => deletePostOrComment()}
            />
        </>
    )
}
export default Delete;
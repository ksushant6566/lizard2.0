import React, { useContext, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth';
import moment from 'moment';

import { FETCH_POST_QUERY, CREATE_COMMENT_MUTATION } from '../../graphql/gql';
import Like from '../../components/Like';
import { Card, Grid, Image, Loader, Button, Label, Message, Form, Transition } from 'semantic-ui-react';
import Delete from '../../components/Delete';

const SinglePost = ({ match, history }) => {
    const postId = match.params.postId
    const { user } = useContext(AuthContext);

    const [comment, setComment] = useState('');
    const commentInputRef = useRef(null);

    const { loading, data: { getPost } = {}, error } = useQuery(FETCH_POST_QUERY, {
        variables: { postId },
    });

    const [submitComment] = useMutation(CREATE_COMMENT_MUTATION, {
        variables: {
            postId,
            body: comment
        },
        update() {
            setComment('')
            commentInputRef.current.blur()
        }
    })

    const callbackForDelete = () => {
        history.push('/');
    }

    if (loading) {
        return (
            <Grid.Row>
                <Loader size='large' />
            </Grid.Row>
        )
    }

    if (error) {
        return (
            <Grid.Row>
                <Message error>
                    {error.graphQLErrors[0].message}
                </Message>
            </Grid.Row>
        )
    }

    const { username, body, createdAt, comments, likes, likesCount, commentsCount } = getPost;
    return (
        <Grid>
            <Grid.Row>
                <Grid.Column >
                    <Card fluid>
                        <Card.Content>
                            <Image
                                floated='right'
                                size="mini"
                                src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
                                as={Link}
                                to={`/users/${username}`}
                            />
                            <Card.Header>{username}</Card.Header>
                            <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                            <Card.Description>{body}</Card.Description>
                        </Card.Content>
                        <hr />
                        <Card.Content>
                            <Like props={{ postId, likesCount, likes, user }} />

                            <Button
                                as='div'
                                labelPosition='right'
                                onClick={() => console.log('comment')}
                            >
                                <Button basic color='blue' icon='comments' />
                                <Label basic color='blue' pointing='left' >{commentsCount}</Label>
                            </Button>

                            {user && user.username && user.username === username && (
                                <Delete
                                    postId={postId}
                                    callback={callbackForDelete}
                                />
                            )}
                        </Card.Content>
                    </Card>

                    {user && (
                        <Card fluid>
                            <Card.Content>
                                <p>Post a comment</p>
                                <Form>
                                    <div className="ui action input fluid">
                                        <input
                                            type='text'
                                            placeholder='comment'
                                            name='comment'
                                            value={comment}
                                            onChange={e => setComment(e.target.value)}
                                            ref={commentInputRef}
                                        />
                                        <button
                                            type="submit"
                                            className="ui button blue"
                                            disabled={comment.trim() === ''}
                                            onClick={submitComment}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </Form>
                            </Card.Content>
                        </Card>
                    )}

                    {commentsCount > 0 && (
                        <h3>
                            Comments
                        </h3>
                    )}
                    <Transition.Group>
                        {commentsCount > 0 && (
                            comments.map(comment => (
                                <Card fluid key={comment.id}>
                                    <Card.Content>
                                        {user && user.username && user.username === comment.username && (
                                            <Delete
                                                postId={postId}
                                                commentId={comment.id}
                                            />
                                        )}
                                        <Card.Header >{comment.username}</Card.Header>
                                        <Card.Description>{comment.body}</Card.Description>
                                        <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    </Card.Content>
                                </Card>
                            ))
                        )}
                    </Transition.Group>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
};
export default SinglePost;
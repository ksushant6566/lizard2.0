import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth';
import moment from 'moment';

import { FETCH_POST_QUERY } from '../../graphql/gql';
import Like from '../../components/Like';
import { Card, Grid, Image, Loader, Button, Label, Message } from 'semantic-ui-react';
import Delete from '../../components/Delete';

const SinglePost = ({ match, history }) => {
    const postId = match.params.postId
    const { user } = useContext(AuthContext);

    const { loading, data: { getPost }={}, error } = useQuery(FETCH_POST_QUERY, {
        variables: { postId },
    });

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

    if(error) {
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
                <Grid.Column width={2}>
                    <Image
                        size="small"
                        src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
                        as={Link}
                        to={`/users/${username}`}
                    />
                </Grid.Column>

                <Grid.Column width={10}>
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>{username}</Card.Header>
                            <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                            <Card.Description>{body}</Card.Description>
                        </Card.Content>
                        <hr/>
                        <Card.Content>
                            <Like props={{ postId, likesCount, likes, user}} />
                            
                            <Button 
                                as='div' 
                                labelPosition='right'
                                onClick={() => console.log('comment')}
                            >
                                <Button basic color='blue' icon='comments' />
                                <Label basic color='blue' pointing='left' >{commentsCount}</Label>
                            </Button>

                            <Delete postId={postId} callback={callbackForDelete} />
                        </Card.Content>
                    </Card>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
};
export default SinglePost;
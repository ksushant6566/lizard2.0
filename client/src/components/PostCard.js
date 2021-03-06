import React, { useContext } from 'react'
import moment from 'moment';
import {Link} from 'react-router-dom'

import { Card, Icon, Label, Image, Button, Popup } from 'semantic-ui-react'
import Like from '../components/Like'
import Delete from '../components/Delete'

import { AuthContext } from '../context/auth';


const PostCard = ({ post }) => {
    const { user } = useContext(AuthContext);

    const { body, createdAt, id, username, likesCount, commentsCount, likes } = post;

    return (
        <Card fluid style={{ marginBottom: 30}}>
            <Card.Content>
                <Image
                    floated="right"
                    size="tiny"
                    src="https://react.semantic-ui.com/images/avatar/small/matthew.png"
                    as={Link}
                    to={`/users/${username}`}
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta
                    as={Link}
                    to={`/posts/${id}`}
                >
                    {moment(createdAt).fromNow()}
                </Card.Meta>
                <Card.Description>{body}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Like props={{ postId: id, likes, likesCount, user }} />

                <Popup 
                    trigger={
                        <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                            <Button color='blue' basic>
                                <Icon name='comments' />
                            </Button>
                            <Label basic color='blue'>
                                {commentsCount}
                            </Label>
                        </Button>
                    }
                    inverted
                    content='comment'
                    on='hover'
                />
                {user && user.username && user.username === username && (
                    <Delete postId={id} />
                )}
            </Card.Content>
        </Card>
    )
}
export default PostCard;


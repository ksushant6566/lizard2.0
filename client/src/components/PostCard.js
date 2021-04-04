import moment from 'moment';
import React from 'react'
import { Card, Icon, Label, Image, Button } from 'semantic-ui-react'
import {Link} from 'react-router-dom'


const PostCard = ({ post }) => {

    const { body, createdAt, id, username, likesCount, commentsCount } = post;

    const likePost = () => {
        console.log("likepost")
    }

    const commentOnPost = () => {
        console.log("comment on post")
    }

    return (
        <Card fluid style={{ marginBottom: 30}}>
            <Card.Content>
                <Image
                    floated="right"
                    size="mini"
                    src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
                    as={Link}
                    to={`/users/${username}`}
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta
                    as={Link}
                    to={`/post/${id}`}
                >
                    {moment(createdAt).fromNow()}
                </Card.Meta>
                <Card.Description>{body}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button as='div' labelPosition='left' onClick={likePost}>
                    <Button color='teal' basic>
                        <Icon name='heart' />
                    </Button>
                    <Label basic color='teal' pointing='left'>
                        {likesCount}
                    </Label>
                </Button>
                <Button as='div' labelPosition='right' onClick={commentOnPost}>
                    <Button color='blue' basic>
                        <Icon name='comments' />
                    </Button>
                    <Label basic color='blue' pointing='left'>
                        {commentsCount}
                    </Label>
                </Button>
            </Card.Content>
        </Card>
    )
}
export default PostCard;


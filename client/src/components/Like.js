import React, { useState, useEffect } from 'react';
import { Icon, Label, Button, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import { LIKE_POST_MUTATION } from '../graphql/gql'
import { useMutation } from '@apollo/react-hooks';

const Like = ({ props: { postId, likes, likesCount, user } }) => {
  const [liked, setLiked] = useState(false);


  useEffect(() => {
    if (user && likes.find(like => like.username === user.username)) {
      setLiked(true)
    } else setLiked(false)

  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId },
    onError(err) {
      console.log(err)
    }

  })

  const likeButton = user ? (
    liked ? (
      <Popup
        trigger={
          <Button color='blue' onClick={likePost}>
            <Icon name="heart" />
          </Button>
        }
        inverted
        content='Unlike'
        on='hover'
      />
    ) : (
      <Popup
        trigger={
          <Button color='blue' basic onClick={likePost}>
            <Icon name="heart" />
          </Button>
        }
        inverted
        content='Like'
        on='hover'
      />
    )
  ) : (
    <Button as={Link} to="/login" color='blue' basic>
      <Icon name="heart" />
    </Button>
  );

  return (

    <Button as='div' labelPosition='left' >
      {likeButton}
      <Label basic color='blue'>
        {likesCount}
      </Label>
    </Button>

  )
}
export default Like;






// changing cache manually

// update(proxy, { data: { likePost }}) {
//   const data = proxy.readQuery({
//     query: FETCH_POSTS_QUERY
//   });
//   console.log(data.getPosts)

//   const updatedPosts = data.getPosts.map(post => {
//     if(post.id === postId) {
//       return {
//         ...post,
//         ...likePost
//       }
//     }else return post;
//   })

//   console.log(updatedPosts)

// },
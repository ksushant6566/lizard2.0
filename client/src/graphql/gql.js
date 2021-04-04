import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
{
    getPosts{
        body
        id
        createdAt
        likes {
            id
            username
            createdAt
        }
        comments {
            id
            body
            username
        }
        username
        likesCount
        commentsCount
    }
}
`

export const CREATE_POST_MUTATION = gql`
mutation createPost($body: String!) {
    createPost(body: $body) {
        id
        body
        createdAt
        username
        likes {
            id username createdAt
        }
        comments {
            id body username createdAt
        }
        likesCount
        commentsCount
    }
}
`

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
export const LOGIN_USER = gql`
    mutation login (
        $username: String!
        $password: String!
    ) {
        login (
            username: $username
            password: $password
        ) {
            id
            username
            email
            createdAt
            token
        }
    }
`
export const REGISTER_USER = gql`
mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
) {
    register(
        registerInput: {
            username: $username
            email: $email
            password: $password
            confirmPassword: $confirmPassword
        }
    ) {
        id
        username
        email
        createdAt
        token
    }
}
`
export const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!) {
        likePost(postId: $postId) {
            id
            likes {
                id 
                username
                createdAt
            }
            likesCount
        }
    }
`
export const FETCH_POST_QUERY = gql`
    query getPost($postId: ID!) {
        getPost(postId: $postId) {
            id
            username
            body
            createdAt
            likes {
                id
                username
                createdAt
            }
            likesCount
            comments {
                id 
                username
                body
                createdAt
            }
            commentsCount
        }
    }
`
export const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!) {
        deletePost(postId: $postId)
    }
`
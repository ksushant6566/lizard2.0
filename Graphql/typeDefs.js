const { gql } = require('apollo-server');

module.exports = gql`

    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        likes: [Like]!
        comments: [Comment]!
        likesCount: Int!
        commentsCount: Int!
    }

    type Comment {
        id: ID!
        body: String!
        username: String!
        createdAt: String!
    }

    type Like {
        id: ID!
        username: String!
        createdAt: String!
    }

    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }

    type Notification {
        type: String!
        username: String!
        postId: ID!
    }

    input RegisterInput {
        username: String!
        email: String!
        password: String!
        confirmPassword: String!
    }

    type Query {
        getPosts(prevKey: ID): [Post]
        getPost(postId: ID!): Post
    }

    type Mutation {
        register(registerInput: RegisterInput): User!

        login(username: String!, password: String!): User!

        createPost(body: String!): Post!

        deletePost(postId: ID!): String!

        createComment(postId: ID!, body: String!): Post!

        deleteComment(postId: ID!, commentId: ID!): Post!

        likePost(postId: ID!): Post!
    }

    type Subscription {
        notification: Notification!
    }

`
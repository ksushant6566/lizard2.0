const { gql } = require('apollo-server');

module.exports = gql`

    type Post {
        id: String!
        body: String!
        createdAt: String!
        username: String!
        likes: [Like]!
        comments: [Comment]!
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

    input RegisterInput {
        username: String!
        email: String!
        password: String!
        confirmPassword: String!
    }

    type Query {
        getPosts : [Post]
        getPost(postId: ID!): Post
    }

    type Mutation {
        register(registerInput: RegisterInput): User!

        login(username: String!, password: String!): User!

        createPost(body: String!): Post!

        deletePost(postId: ID!): String!

        createComment(postId: ID!, body: String!): Comment

        deleteComment(postId: ID!, commentId: ID!): Post!

        likePost(postId: ID!): Post!
    }

`
const commentsResolvers = require('./comments.resolvers');
const postsResolvers = require('./posts.resolvers');
const usersResolvers = require('./users.resolvers');


module.exports = {
    Post: {
        likesCount: (parent) => parent.likes.length,
        commentsCount: (parent) => parent.comments.length
    },

    Query : {
        ...postsResolvers.Query
    },

    Mutation : {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation,
    }
}
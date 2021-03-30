const { UserInputError } = require('apollo-server-errors');
const Post = require('../../models/Post.model');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
    Mutation: {
        async createComment(_, { postId, body }, context) {
            const user = checkAuth(context);

            if(body.trim() === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment cannot be empty'
                    }
                })
            }
            const post = await Post.findById(postId);

            if(Post) {
                post.comments.push({
                    body,
                    username: user.username,
                    createdAt: new Date().toISOString()
                })
            }
        }
    }
}
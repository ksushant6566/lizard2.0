const { UserInputError, AuthenticationError } = require('apollo-server-errors');
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
                post.comments.unshift({
                    body,
                    username: user.username,
                    createdAt: new Date().toISOString()
                })

                await post.save();

                // context.pubsub.publish('NOTIFICATION', {
                //     notification: {
                //         type: 'new_comment',
                //         receiver: post.username,
                //         username: user.username,
                //         postId: postId
                //     }
                // })

                return post;
            }else throw new UserInputError('Post not found');
        },

        async deleteComment(_, { postId, commentId }, context) {
            const user = checkAuth(context);

            const post =  await Post.findById(postId);
            if(post) {

                const cmntIndex = post.comments.findIndex(cmnt => cmnt.id === commentId);
                if(cmntIndex != -1) {
                    if(post.comments[cmntIndex].username === user.username ) {
                        post.comments.splice(cmntIndex, 1);
                        await post.save();
                        return post;
                    }else throw new AuthenticationError('Not Authorized')

                } else throw new UserInputError('Comment not found');
            } else throw new UserInputError('Post not found');
        }
    }
}
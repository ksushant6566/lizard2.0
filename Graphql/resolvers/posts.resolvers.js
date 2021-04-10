const { AuthenticationError, UserInputError } = require('apollo-server-errors');
const Post = require('../../models/Post.model');
const checkAuth = require('../../utils/checkAuth');

module.exports = {

    Query: {
        async getPosts(_, { prevKey }) {
            try {

                if(prevKey) {
                    const posts = await Post.find({ _id: { $lt: prevKey } }).limit(2).sort({ createdAt: -1 });
                    return posts;
                }

                const posts = await Post.find().limit(2).sort({ createdAt: -1 });
                return posts;
            } catch (error) {
                throw new Error(error);
            }
        },

        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId);
                if (post) return post;

                throw new Error('Post not found');

            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context) {
            const user = checkAuth(context);
            
            body = body.trim();
            if(body === '')
                throw new UserInputError('Post cannot be empty');

            const newPost = new Post({
                body,
                username: user.username,
                user: user.id,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save();

            context.pubsub.publish('NOTIFICATION', {
                notification: {
                    type: 'new posts',
                    postId: post._id,
                    username: user.username
                }
            });

            return post;
        },

        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);
            // console.log(user);

            try {
                const post = await Post.findById(postId);
                if (post.username === user.username) {
                    await post.delete();
                    return 'Post deleted successfully';
                }
                throw new AuthenticationError('Not authorized');
            } catch (error) {
                throw new Error(error);
            }
        },

        async likePost(_, { postId }, context) {
            const user = checkAuth(context);

            const post = await Post.findById(postId);
            if (post) {
                const likeIndex = post.likes.findIndex(like => like.username === user.username);
                if (likeIndex === -1) {
                    post.likes.unshift({
                        username: user.username,
                        createdAt: new Date().toISOString()
                    })
                } else {
                    post.likes.splice(likeIndex, 1);
                }
                await post.save();
                return post;
            } else throw new UserInputError('Post not found');
        }
    }, 
    Subscription: {
        notification: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NOTIFICATION')
        }
    }
}

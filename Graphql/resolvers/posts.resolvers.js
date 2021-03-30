const { AuthenticationError } = require('apollo-server-errors');
const Post = require('../../models/Post.model');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
    
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (error) {
                throw new Error(error);
            }
        },

        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId);
                if(post) return post;
                
                throw new Error('Post not found');

            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context) {
            const user = checkAuth(context);
            // console.log(user);

            const newPost = new Post({
                body,
                username: user.username,
                user: user.id,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save();
            return post;
        },

        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);
            // console.log(user);

            try {
                const post = await Post.findById(postId);
                if(post.username === user.username) {
                    await post.delete();
                    return 'Post deleted successfully';
                }
                throw new AuthenticationError('Not authorized');
            } catch (error) {
                throw new Error(error);
            }
        }

    }
}

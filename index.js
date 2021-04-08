// dependencies
const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');

// config variables
const { ATLAS_URI } = require('./config');

// models
const Post = require('./models/Post.model');
const User = require('./models/User.model');

// typedefs
const typeDefs = require('./Graphql/typeDefs.js');

// resolvers
const resolvers = require('./Graphql/resolvers');

const pubsub = new PubSub();

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub }),
    subscriptions: {
        path: '/subscriptions'
    },
});

mongoose.connect(ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("connected to database");
        return server.listen({ port: PORT })
    })
    .then(res => {
        console.log(`server running at ${res.url}`);
    })
    .catch(err => {
        console.log(err);
    })
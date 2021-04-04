// dependencies
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

// config variables
const { ATLAS_URI } = require('./config');

// models
const Post = require('./models/Post.model');
const User = require('./models/User.model');

// typedefs
const typeDefs = require('./graphql/typeDefs');

// resolvers
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
});

mongoose.connect(ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("connected to database");
        return server.listen({ port: 5000 })
    })
    .then(res => {
        console.log(`server running at ${res.url}`);
    })
    .catch(err => {
        console.log(err);
    })
import React from 'react';
import App from './App';
import { split } from '@apollo/client';
import ApolloClient from 'apollo-client';
import { getMainDefinition } from '@apollo/client/utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext} from 'apollo-link-context';

const httpLink = createHttpLink({
  // uri: 'https://lizard-backend.herokuapp.com/'
  uri: 'http://localhost:5000/'
});

const wsLink = new WebSocketLink({
  // uri: 'wss://lizard-backend.herokuapp.com/subscriptions',
  uri: 'ws://localhost:5000/subscriptions',
  options: {
    reconnect: true
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache()
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
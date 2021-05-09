/* eslint-disable no-loop-func */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import Login from './pages/login/Login';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import { fromPromise, ApolloClient, InMemoryCache, ApolloProvider, ApolloLink, HttpLink, concat, from,createHttpLink} from '@apollo/client';
import {AUTHENTICATION, setToken} from './hooks/useAuth';
import { setContext } from '@apollo/client/link/context';
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwt_decode from 'jwt-decode';
import { REFRESH_TOKEN } from './graphql/mutations';
import { onError } from "@apollo/client/link/error";


const httpLink = new createHttpLink({uri: 'http://localhost:4000', credentials:'include'});

const authLink = new ApolloLink((operation, forward)=>{
  operation.setContext({
      headers:{
        authorization: `Bearer ${AUTHENTICATION.token}`,
      }
    });
    return forward(operation);
  });

let isRefreshing = false;
let pendingRequests = [];

const resolvePendingRequests = () => {
  pendingRequests.map(callback => callback());
  pendingRequests = [];
};


const errorLink = onError( ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors)
      for(let error of graphQLErrors){
        if(error.extensions.code === 'UNAUTHENTICATED'){
          let forward$;
          if (!isRefreshing) {
            isRefreshing = true;
            forward$ = fromPromise(
              client.mutate({mutation:REFRESH_TOKEN})
                .then(data => {
                  let token = true; // this promise should return a truthsy value for req/res to pass through all links
                  if(data.data.refreshToken){
                    token = data.data.refreshToken.token;
                    setToken(token);
                  }
                  resolvePendingRequests();
                  return token;
                })
                .catch(error => {
                  pendingRequests = [];
                  return;
                })
                .finally(() => {
                  isRefreshing = false;
                })
            ).filter(value => Boolean(value)); 
          } else {
            // Will only emit once the Promise is resolved
            forward$ = fromPromise(
              new Promise(resolve => {
                pendingRequests.push(() => resolve());
              })
            );
          }
          return forward$.flatMap(() => forward(operation));
        }
      }
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });


const client = new ApolloClient({
  link:from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache()
});

client.mutate({mutation:REFRESH_TOKEN}).then(console.log);

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Switch>
          <App/>
        </Switch>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);





// const tokenRefresher = new TokenRefreshLink({
//   accessTokenField:"token",
//   isTokenValidOrUndefined: ()=>{
//     console.log("cj.");
//     const token = AUTHENTICATION.token;
//     if (!token) {
//       return true;
//     }
//     try {
//       const { exp } = jwt_decode(token);
//       if(Date.now() >= exp * 1000) {
//         return false;
//       } else {
//         return true;
//       }
//     } catch {
//       return false;
//     }
//   },
//   fetchAccessToken: async () => {
//     console.log("handleFetchRunning.");
//     return client.mutate({mutation:REFRESH_TOKEN});
//   },
//   handleFetch: (token)=>{
//     console.log(token);
//     setToken(token);
//   },
//   handleError: err => {
//     console.warn("Your refresh token is invalid. Try to relogin");
//     console.error(err);
//   }
// })
import { ApolloServer, gql } from 'apollo-server';
import typeDefs from './typeDefs.js';
import resolvers from './resolvers.js';
import { verifyToken } from './auth.js';
import express from 'express';
import cookieParser from 'cookie-parser';


const server = new ApolloServer({
    cors: {
		origin: "http://localhost:3000",			// <- allow request from all domains
		credentials: true
    },	
    typeDefs,
    resolvers,
    context: ({req, res})=>{
        let username = null;
        if(req.headers.authorization){
            const token = req.headers.authorization;
            const payload = verifyToken(token.split(' ')[1]);
            if(payload) username = payload.username;
        }
        return {username, req, res};
    },
});


server.listen().then(({url}) => console.log(`Server running at ${url}`));
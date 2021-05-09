import { AuthenticationError } from 'apollo-server-errors';
import jwt from 'jsonwebtoken';
import {db} from './db.js';

const SECRET_KEY = 'allgrace';

const generateToken = (payload) => jwt.sign(payload, SECRET_KEY, {expiresIn:5});

const verifyToken = (token) => {
    try{
        const payload = jwt.verify(token, SECRET_KEY);
        return payload;
    }catch(error){
        return null;
    }
}

const generateRefreshToken = (payload) => jwt.sign(payload, SECRET_KEY, {expiresIn:'7d'});

const setCookie = (res, value) => {
    res.cookie('refresh', value, {httpOnly:true});
}

const authenticated = (resolver) => {
    return function(parent, args, context){
        if(context.username) return resolver(parent, args, context);
        else throw new AuthenticationError('not authenticated');
    }
}


export {
    SECRET_KEY,
    generateToken,
    verifyToken,
    authenticated,
    generateRefreshToken,
    setCookie
}

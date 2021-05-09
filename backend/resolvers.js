
import {generateToken, generateRefreshToken,authenticated, verifyToken, setCookie} from './auth.js';
import cookie from 'cookie';
import {getUserTokenVersion, db} from './db.js';
const resolvers = {
    Query:{
        myProfile: authenticated((_,__,context)=>{
            for(let user of db.users){
                if(user.username===context.username){
                    return user;
                }
            }
        })
    },
    Mutation:{
        signIn: (_, {username, password}, {res})=>{
            //SignIn Logic!
            let token = null;
            for(let user of db.users){
                if(username === user.username && password===user.password){
                    token=generateToken({username});
                    setCookie(res, generateRefreshToken({username, tokenVersion: getUserTokenVersion(username)}))
                    return {
                        token,
                        user
                    }
                }
            }
            throw new Error('Username/Password is invalid.');
        },

        signUp: (_, {username, password, name}, {res})=>{
            //Logic for checking duplicate username!
            db.users.forEach(u=>{
                if(u.username===username){
                    throw new Error('SignUp failed, username taken already.');
                }
            })

            //Logic for creating a new user.
            const newUser = {username,password,name, tokenVersion:1};
            db.users.push(newUser)

            //generate Token for new user.
            const token=generateToken({username});
            setCookie(res, generateRefreshToken({username, tokenVersion:getUserTokenVersion(username)}));
            res.cookie('rishabh',"chandra");
            return {
                token,
                user:newUser
            }            
        },

        refreshToken: (_,__,{req, res})=>{
            const rt = cookie.parse(req.headers.cookie).refresh;
            if(!rt){
                return null;
            }
            const payload = verifyToken(rt);
            if(!payload){
                return null
            }
            if(payload.tokenVersion !== getUserTokenVersion(payload.username)) return null;

            setCookie(res, generateRefreshToken({username:payload.username, tokenVersion:getUserTokenVersion(payload.username)}));
            return {
                token: generateToken({username: payload.username}),
                username: payload.username
            }
        },

        logOut: (_,__,{res})=>{
            setCookie(res, "");
            return true;
        },

        changePassword: authenticated((_,{username, oldPassword, newPassword}, context)=>{
            //password doesn't match.
            for(let user of db.users){
                if(user.username === username){
                    if(user.password === oldPassword){
                        user.password = newPassword;
                        user.tokenVersion = user.tokenVersion + 1;
                    }else{
                        throw new Error("Incorrect Credentials.");
                    }
                }
            }
            setCookie(context.res, generateRefreshToken({username:username, tokenVersion: getUserTokenVersion(username)}));
            return {
                token: generateToken({username: username}),
                username: username
            }
        })

    }
};

export default resolvers;
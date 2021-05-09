import {gql} from 'apollo-server';

const typeDefs = gql`

    type User{
        username: String! 
        name: String!
        password: String!
        tokenVersion: Int!
    }
    
    type AuthUser{
        token: String!
        user: User!
    }

    type Query{
        myProfile:User!
    }

    type Mutation{
        signIn(username:String!, password:String!): AuthUser!
        signUp(name:String!, username:String!, password:String!): AuthUser!
        refreshToken: AuthUser
        logOut: Boolean!
        changePassword(username:String!, oldPassword:String!, newPassword:String!): AuthUser!
    }


`;

export default typeDefs;
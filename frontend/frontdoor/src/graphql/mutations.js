import {gql} from '@apollo/client';

const SIGN_IN = gql`

mutation SIGNIN($username: String!, $password:String!){
  signIn(username:$username, password:$password){
    token,
    user{
      username
    }
  }
}

`;


const SIGN_UP = gql`

mutation SIGNUP($username: String!, $password:String!, $name:String!){
  signUp(username:$username, password:$password, name:$name){
    token,
    user{
      name,
      username
    }
  }
}

`;


const SHOW_PROFILE = gql`

  query SHOW_PROFILE{
    myProfile{
      name,
      username,
      password
    }
  }

`;

const LOG_OUT = gql`
mutation LOG_OUT{
  logOut
}

`;

const REFRESH_TOKEN = gql`
mutation REFRESH_TOKEN{
  refreshToken{
    token
  }
}

`;

const CHANGE_PASSWORD = gql`

mutation CHANGE_PASSWORD($username:String!, $oldPassword:String!, $newPassword:String!){
  changePassword(username:$username, oldPassword:$oldPassword, newPassword:$newPassword){
    token
  }
}

`

export {
    SIGN_IN,
    SIGN_UP,
    SHOW_PROFILE,
    LOG_OUT,
    REFRESH_TOKEN,
    CHANGE_PASSWORD
}
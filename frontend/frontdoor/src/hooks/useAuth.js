import jwt_decode from "jwt-decode";

export const AUTHENTICATION = {
  token:null,
  username:"GOD"
}

export const setToken = token => {
  let username = "GOD";
  if(token) username = jwt_decode(token).username;
  AUTHENTICATION.username = username;
  AUTHENTICATION.token = token;
}



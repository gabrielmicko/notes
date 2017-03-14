import jwt from 'jsonwebtoken';
import Config from '../Config/config.json'
import axios from 'axios';

const secret = Config.tokenSecret;
const date = Math.floor(Date.now() / 1000) + (60 * 60)

function login(user) {
    return jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      data: user
    }, secret);
}

function getToken(token) {
  try {
    let data = jwt.verify(token, secret);
    if(data) {
      return data.data;
    }
  }
  catch(e) {
  }
  return false;
}

function isToken(token) {
  try {
    let data = jwt.verify(token, secret);
    if(data) {
      return true;
    }
  }
  catch(e) {
  }
  return false;
}

export { login, getToken, isToken };
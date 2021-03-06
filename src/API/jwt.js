import jwt from 'jsonwebtoken';
import Config from '../Config/config.json';
const secret = Config.tokenSecret;

function login(user) {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
      data: user
    },
    secret
  );
}

function getToken(token) {
  try {
    let data = jwt.verify(token, secret);
    if (data) {
      return data.data;
    }
  } catch (e) {}
  return false;
}

function isToken(token) {
  try {
    let data = jwt.verify(token, secret);
    if (data) {
      return true;
    }
  } catch (e) {}
  return false;
}

function decodeToken(token) {
  try {
    let data = jwt.decode(token, secret);
    return data;
  } catch (e) {
    return false;
  }
}

function getID(token) {
  try {
    let data = decodeToken(token);
    if (data) {
      return data.data;
    }
    return false;
  } catch (e) {
    return false;
  }
}

export { login, getToken, isToken, decodeToken, getID };

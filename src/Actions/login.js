function login(token) {
  return {
    type: 'LOGIN',
    token: token
  };
}

function logout() {
  return {
    type: 'LOGOUT',
    token: false
  };
}

export { login, logout };

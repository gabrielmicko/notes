function setUsername(username) {
  return {
    type: 'SET_USERNAME',
    username: username
  };
}

function addLog(log) {
  let d = new Date();
  let m = d.getMinutes();
  let h = d.getHours();

  return {
    type: 'ADD_LOG',
    log: h + ':' + m + ': ' + log
  };
}

export { setUsername, addLog };

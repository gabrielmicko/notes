function setUsername(username) {
  return {
    type: 'SET_USERNAME',
    username: username
  };
}

function setSearch(searchValue) {
  return {
    type: 'SET_SEARCH',
    search: searchValue
  };
}

function setBoxState(boxState) {
  return {
    type: 'SET_BOXSTATE',
    state: boxState
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

export { setUsername, addLog, setSearch, setBoxState };

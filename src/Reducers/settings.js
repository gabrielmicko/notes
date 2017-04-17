let settings = {
  username: false
};

const login = (state = settings, action) => {
  switch (action.type) {
    case 'SET_USERNAME':
      var settings = Object.assign({}, state);
      settings.username = action.username;
      return settings;
      break;
    default:
      return state;
  }
};

export default login;

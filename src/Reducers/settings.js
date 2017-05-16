let settings = {
  username: false,
  log: []
};

const login = (state = settings, action) => {
  switch (action.type) {
    case 'SET_USERNAME':
      var settings = Object.assign({}, state);
      settings.username = action.username;
      return settings;
      break;
    case 'ADD_LOG':
      var settings = Object.assign({}, state);
      settings.log = [...[action.log], ...state.log];
      return settings;
      break;
    default:
      return state;
  }
};

export default login;

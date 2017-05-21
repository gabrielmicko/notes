let settings = {
  username: false,
  log: [],
  search: ''
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
    case 'SET_SEARCH':
      var settings = Object.assign({}, state);
      settings.search = action.search;
      return settings;
      break;
    case 'SET_BOXSTATE':
      var settings = Object.assign({}, state);
      settings.boxState = action.state;
      return settings;
      break;
    default:
      return state;
  }
};

export default login;

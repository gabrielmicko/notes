import _findIndex from 'lodash/findIndex';
let testNotes = [];

const notes = (state = testNotes, action) => {
  switch (action.type) {
    case 'SET_NOTES':
      return action.notes;
      break;
    case 'UPDATE_NOTE':
      var key = parseFloat(_findIndex(state, { id: action.id }));
      var note = Object.assign({}, action.note[0]);
      return [
        ...state.slice(0, key),
        ...[note],
        ...state.slice(key + 1, state.length)
      ];
      break;
    case 'UPDATE_NOTE_PROPERTY':
      var key = parseFloat(_findIndex(state, { id: action.id }));
      var note = Object.assign({}, state[key]);
      note[action.property] = action.value;
      return [
        ...state.slice(0, key),
        ...[note],
        ...state.slice(key + 1, state.length)
      ];
      break;
    case 'ADD_NOTE':
      return [...state, ...[action.note]];
      break;
    case 'REMOVE_NOTE':
      var key = parseFloat(_findIndex(state, { id: action.id }));
      return [...state.slice(0, key), ...state.slice(key + 1, state.length)];
      break;
    default:
      return state;
  }
};

export default notes;

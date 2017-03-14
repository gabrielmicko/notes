import _findIndex from 'lodash/findIndex';
let testNotes = [];

const notes = (state = testNotes, action) => {
    switch(action.type){
        case 'SET_NOTES':
            return action.notes;
        break;
        case 'UPDATE_NOTE':
          let key = parseFloat(_findIndex(state, {'id':action.id}));
          var note = Object.assign({}, action.note[0]);
          return [
            ...state.slice(0, key),
            ...[note],
            ...state.slice(key + 1, state.length),
          ];
        break;
        case 'ADD_NOTE':
          return [
            ...state,
            ...action.note,
          ];
        break;
        default:
        return state;
    }
}

export default notes;

import _findIndex from 'lodash/findIndex';
let testNotes = []

const notes = (state = testNotes, action) => {
    switch(action.type){
        case 'SET_NOTES':
            return action.notes;
        break;
        case 'UPDATE_NOTE':
          let key = parseFloat(_findIndex(state, {'id':action.id}));
          var c= [
            ...state.slice(0, key),
            ...action.note,
            ...state.slice(key + 1, state.length),
          ];
          return c;
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

let testNotes = [];

const masternotes = (state = testNotes, action) => {
  switch (action.type) {
    case 'SET_MASTERNOTES':
      return action.notes;
      break;
    default:
      return state;
  }
};

export default masternotes;

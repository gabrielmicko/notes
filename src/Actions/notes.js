function setNotes(notes) {
  return {
    type: 'SET_NOTES',
    notes: notes
  };
}

function setMasterNotes(notes) {
  return {
    type: 'SET_MASTERNOTES',
    notes: notes
  };
}

function updateNoteByProperty(id, property, value) {
  return {
    type: 'UPDATE_NOTE_PROPERTY',
    id: id,
    property: property,
    value: value
  };
}

function pushNote(note) {
  return {
    type: 'ADD_NOTE',
    note: note
  };
}

function removeNote(id) {
  return {
    type: 'REMOVE_NOTE',
    id: id
  };
}

export { setNotes, setMasterNotes, updateNoteByProperty, pushNote, removeNote };

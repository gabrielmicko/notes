function setNotes(notes) {
  return {
    type: 'SET_NOTES',
    notes: notes,
  };
}

function updateNote(note, id) {
  return {
    type: 'UPDATE_NOTE',
    note: note,
    id: id,
  };
}

function pushNote(note) {
  return {
    type: 'ADD_NOTE',
    note: note,
  };
}

export { setNotes, updateNote, pushNote };

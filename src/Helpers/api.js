import axios from 'axios';
import Config from '../Config/config.json';
import _findIndex from 'lodash/findIndex';

function query(query) {
  return axios.get(`${Config.graphQLServer}?query=${query}`);
}

function post(query, vars) {
  var graphQLQuery = {
    query: query,
    variables: vars
  };
  return axios.post(Config.graphQLServer, JSON.stringify(graphQLQuery), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

function getNotes(token = '', id = '', title = '', args = []) {
  if (token) {
    token = `token:"${token}",`;
  }

  if (id) {
    id = `id:${id},`;
  }

  if (title) {
    title = `title:"${title}",`;
  }

  if (args) {
    args = args.join(',');
  }

  let params = '';
  if (token || id || title) {
    params = `(${token}${id}${title})`;
  }

  let queryString = `{notes${params}{${args}}}`;

  return query(queryString);
}

function registerUser(username, password, args = []) {
  if (args) {
    args = args.join(',');
  }
  let registerUser = `mutation registerUser($username:String!,$password:String!){registerUser(username:$username,password:$password){${args} }}`;
  return post(registerUser, {
    username: username,
    password: password
  });
}

function addNote(
  token = '',
  url = '',
  title = '',
  text = '',
  pvt = '',
  args = []
) {
  if (args) {
    args = args.join(',');
  }
  let addNote = `mutation addNote($token: String!, $url: String!, $title: String!, $text: String!, $pvt: Boolean!) {addNote(token: $token, url:$url, title:$title, text:$text, private:$pvt) {${args}}}`;
  return post(addNote, {
    token: token,
    url: url,
    title: title,
    text: text,
    pvt: pvt
  });
}

function editNote(
  token = '',
  id = '',
  url = '',
  title = '',
  text = '',
  pvt = '',
  args = []
) {
  if (args) {
    args = args.join(',');
  }
  let editNote = `mutation editNote($token: String!, $id: Int!, $url: String!, $title: String!, $text: String!, $pvt: Boolean!) {editNote(token: $token, id:$id, url:$url, title:$title, text:$text, private:$pvt){${args}}}`;
  return post(editNote, {
    token: token,
    id: id,
    url: url,
    title: title,
    text: text,
    pvt: pvt
  });
}

function deleteNote(token = '', id = '', args = []) {
  if (args) {
    args = args.join(',');
  }
  let deleteNote = `mutation deleteNote ($token: String!, $id: Int!){deleteNote(token: $token, id:$id) {${args}}}`;
  return post(deleteNote, {
    token: token,
    id: id
  });
}

function auth(username = '', password = '', args = []) {
  if (args) {
    args = args.join(',');
  }
  let authNote = `{auth(username: "${username}", password: "${password}") {${args}}}`;
  return query(authNote);
}

function saveNotes(token, notes, masternotes) {
  var actionPromises = [];
  var notes = [...notes];
  function popNote(id) {
    let index = _findIndex(notes, function(note) {
      return note.id == id;
    });
    if (index !== -1) {
      return notes.splice(index, 1);
    } else {
      return false;
    }
  }

  if (masternotes.length > 0) {
    masternotes.forEach(function(note) {
      let poppedNote = popNote(note.id);
      if (poppedNote) {
        if (poppedNote[0].deleted === true) {
          actionPromises.push(deleteNote(token, poppedNote[0].id, ['id']));
        } else if (
          note.url !== poppedNote[0].url ||
          note.title !== poppedNote[0].title ||
          note.text !== poppedNote[0].text ||
          note.private !== poppedNote[0].private
        ) {
          actionPromises.push(
            editNote(
              token,
              poppedNote[0].id,
              poppedNote[0].url,
              poppedNote[0].title,
              poppedNote[0].text,
              poppedNote[0].private,
              ['id']
            )
          );
        }
      }
    });
  }
  if (notes.length > 0) {
    notes.forEach(function(note) {
      if (note.deleted === false) {
        actionPromises.push(
          addNote(token, note.url, note.title, note.text, note.private, ['id'])
        );
      }
    });
  }
  return Promise.all(actionPromises);
}

export {
  getNotes,
  query,
  addNote,
  editNote,
  deleteNote,
  auth,
  saveNotes,
  registerUser
};

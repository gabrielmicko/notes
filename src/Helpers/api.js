import axios from 'axios';
import Config from '../Config/config.json';

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
  if(token) {
    token = `token:"${token}",`;
  }

  if(id) {
    id = `id:${id},`;
  }

  if(title) {
    title = `title:"${title}",`;
  }

  if(args) {
    args = args.join(",");
  }

  let params = '';
  if(token || id || title)  {
    params = `(${token}${id}${title})`;
  }

  let queryString = `{notes${params}{${args}}}`;

  return query(queryString);
}

function addNote(token = '', url = '', title = '', text = '', pvt = '', args = []) {
    if (args) {
      args = args.join(",");
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

function editNote(token = '', id = '', url = '', title = '', text = '', pvt = '', args = []) {
  if(args) {
    args = args.join(",");
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
  if(args) {
    args = args.join(",");
  }
  let deleteNote = `mutation deleteNote ($token: String!, $id: Int!){deleteNote(token: $token, id:$id) {${args}}}`;
  return post(deleteNote, {
    token: token,
    id: id
  });
}

function auth(username = '', password = '', args = []) {
  if(args) {
    args = args.join(",");
  }
  let authNote = `{auth(username: "${username}", password: "${password}") {${args}}}`;
  return query(authNote);
}

export { getNotes, query, addNote, editNote, deleteNote, auth };

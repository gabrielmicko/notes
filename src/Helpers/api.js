import axios from 'axios';
import Config from '../Config/config.json';

function query(query) {
  return axios.get(`${Config.graphQLServer}?query=${query}`);
}

function post(query) {
  return axios.post(`${Config.graphQLServer}?query=${query}`);
}

function getNotes(token = '', id = '', title = '', args = []) {
  console.log('TOKEN');
  if(token) {
    console.log(token);
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
  if(args) {
    args = args.join(",");
  }
  let addNote = `mutation addNote {addNote(token: "${token}", url:"${url}", title:"${title}", text:"${text}", private:${pvt}) {${args}}}`;
  return post(addNote);
}

function editNote(token = '', id = '', url = '', title = '', text = '', pvt = '', args = []) {
  if(args) {
    args = args.join(",");
  }
  let editNote = `mutation editNote {editNote(token: "${token}", id:${id}, url:"${url}", title:"${title}", text:"${text}", private:${pvt}){${args}}}`;
  return post(editNote);
}

function deleteNote(token = '', id = '', args = []) {
  if(args) {
    args = args.join(",");
  }
  let deleteNote = `mutation deleteNote {deleteNote(token: "${token}", id:${id}) {${args}}}`;
  return post(deleteNote);
}

function auth(username = '', password = '', args = []) {
  if(args) {
    args = args.join(",");
  }
  let authNote = `{auth(username: "${username}", password: "${password}") {${args}}}`;
  return query(authNote);
}

export { getNotes, query, addNote, editNote, deleteNote, auth };

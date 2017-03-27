import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './Containers/App';
import IndexAction from './Components/Index';
import AddAction from './Components/Add';
import LoginAction from './Components/Login';
import NoteAction from './Components/Note';
import LogoutAction from './Components/Logout';
import EditAction from './Components/Edit';
import LanucherAction from './Components/Launcher';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={LoginAction} />
        <Route path="/launcher" component={LanucherAction} />
        <Route path="/list" component={IndexAction} />
        <Route path="/add" component={AddAction} />
        <Route path="/edit/:id" component={EditAction} />
        <Route path="/login" component={LoginAction} />
        <Route path="/logout" component={LogoutAction} />
        <Route path="/note/:id(/:title)" component={NoteAction} />
    </Route>
);

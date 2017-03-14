let token = false;

const login = (state = token, action) => {
    switch(action.type){
        case 'LOGIN':
        case 'LOGOUT':
            return action.token;
        break;
        default:
        return state;
    }
}

export default login;

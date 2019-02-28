import actions from './actions';

//initial state of login reducer

//check whether login is true or false
//if logged in, set navbar text to Logout, if logged out set navbar text to Login
//store user email to use with other components
const initialState = {
    login: false,
    text: "Login",
    user: '',
    isAdmin: false
};

const reducer = (state = initialState, action) => {
    switch(action.type){
        //if user is logged in, change state to true
        case actions.LOGGED_IN:
            return{
                //updating state immutably
                //disperse contents of original state object
                ...state,
                //assign login value to true based on payload action name
                //assign email to user's email after logging in
                //return new state object with updated 
                login: true,
                text: "Logout",
                user: action.user
            }
        //when an admin is logged in
        case actions.ADMIN_LOGGED_IN:
            return{
                ...state,
                login: true,
                text: "Logout",
                user:action.user,
                isAdmin: true
            }
        //if user logs out, update state
        case actions.LOGGED_OUT:
            return{
                ...state,
                login: false,
                text: "Login",
                email: '',
                isAdmin: false
            }
        default:
            return state;
    }
};

export default reducer;

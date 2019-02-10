import actions from './actions';

const initialState = {
    login: false,
    text: "Login"
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
                //return new state object with updated 
                login: true,
                text: "Logout"
            }
        case actions.LOGGED_OUT:
            return{
                ...state,
                login: false,
                text: "Login"
            }
        default:
            return state;
    }
};

export default reducer;

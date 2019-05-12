import actions from './actions';

//initial state of login reducer

//check whether login is true or false
//if logged in, set navbar text to Logout, if logged out set navbar text to Login
//store user email to use with other components
const initialState = {
    login: false,
    text: "Login",
    user: '',
    isAdmin: false,
    vendorID: '',
    adminsOf: [],
    currentVendor: ''
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
                isAdmin: true,
                vendorID: action.vid,
                adminsOf: action.admins,
                currentVendor: action.currentVendor,
            }
        //if user logs out, update state
        case actions.LOGGED_OUT:
        return initialState
            // return{
            //     ...state,
            //     login: false,
            //     text: "Login",
            //     email: '',
            //     isAdmin: false,
            //     vendorID: '',
            //     adminsOf: state.adminsOf.length = 0,
            //     currentVendor: ''
            // }
        //update vendor id of user if admin
        case actions.UPDATE_VENDOR_ID:
            return{
              ...state,
              vendorID: action.vid,
              currentVendor: action.vendor
            }
        default:
            return state;
    }
};

export default reducer;

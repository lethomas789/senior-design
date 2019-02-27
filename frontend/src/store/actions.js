//actions to trigger reducer to handle state changes
const actions =  {
    //auth actions
    LOGGED_IN: "LOGGED_IN",
    LOGGED_OUT: "LOGGED_OUT",
    GET_PRODUCTS: "GET_PRODUCTS",
    ADMIN_LOGGED_IN: "ADMIN_LOGGED_IN",
    //cart actions
    GET_CART: "GET_CART",
    ADD_CART:"ADD_CART",
    REMOVE_CART:"REMOVE_CART",
    EMPTY_CART: "EMPTY_CART",
    UPDATE_TOTAL: "UPDATE_TOTAL",
    //vendor actions
    GET_VENDOR_PRODUCTS: "GET_VENDOR_PRODUCTS"
}

export default actions;

import actions from './actions';

//initial state of shop view
const initialState = {
  products: []
}

const reducer = (state = initialState, action) => {
  switch(action.type){
    case actions.GET_PRODUCTS:
      //copy initial state
      //update products array to be array retrieved from GET request to server
      //action.items is payload to update state
      return{
        ...state,
        products: action.items
      }
    default:
      return state;
  }
}

export default reducer;

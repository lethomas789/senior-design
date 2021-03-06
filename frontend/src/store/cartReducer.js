import actions from './actions';
//reducer for managing state of cart for a logged in user

//initial state of cart reducer
const initialState = {
  items: [],
  total: 0
};

const reducer = (state = initialState, action) => {
  //action to get cart items stored on server
  switch(action.type){
    case actions.GET_CART:
      return{
        ...state,
        //get cart items from server, assign to state
        items: action.cart
      }

    //add item to cart, update state
    case actions.ADD_CART:
      return{
        ...state,
        items: state.items.concat(action.item)
      }

    //remove item from cart, update state
    case actions.REMOVE_CART:
      return{

      }

    //empty cart, either on logout or checkout
    case actions.EMPTY_CART:
      return{
        ...state,
        items: state.items.length = 0
      }

    case actions.UPDATE_TOTAL:
      return{
        ...state,
        total: action.total
      }

    default:
      return state;
  }
}

export default reducer;

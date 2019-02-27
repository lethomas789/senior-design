import actions from './actions';

const initialState = {
  vendor: ''
};

const reducer = (state = initialState, action) => {
  switch(action.type){
    case actions.GET_VENDOR_PRODUCTS:
      return{
        ...state,
        vendor: action.vendor
      }

    default:
      return state;
  }
}
export default reducer;

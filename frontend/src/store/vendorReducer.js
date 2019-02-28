import actions from './actions';

const initialState = {
  vendor: '',
  vendors: []
};

const reducer = (state = initialState, action) => {
  switch(action.type){
    case actions.GET_VENDOR_PRODUCTS:
      return{
        ...state,
        vendor: action.vendor
      }

    case actions.GET_VENDORS:
      return{
        ...state,
        vendors: action.vendors
      }

    default:
      return state;
  }
}
export default reducer;

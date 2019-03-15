import actions from './actions';

//initial state
const initialState = {
  selectedItemID: ''
};

const reducer = (state = initialState, action) => {
  switch(action.type){
    case actions.UPDATE_SELECTED_ITEM:
      return{
        ...state,
        selectedItemID: action.itemID
      }
    
    default:
      return state
  }
}

export default reducer;

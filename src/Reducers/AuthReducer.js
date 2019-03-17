
const AuthReducer = (state = { initial: 'Test Reducer' }, action) => {
  switch (action.type) {
    case 'SET_AUTH_ATTRIBUTE' :
      return {
        ...state,
        ...action.data,
      }
    default:
      return state;
  }
};

export default AuthReducer;

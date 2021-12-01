const reducer = (state, action) => {
  if (action.type === "LOADING") {
    return { ...state, loading: true };
  }

  if (action.type === "STORE_USER") {
    return {
      ...state,
      user: action.payload,
      loading: false,
    };
  }
};

export default reducer;

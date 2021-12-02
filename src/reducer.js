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

  if (action.type === "STORE_PROGRESS") {
    return {
      ...state,
      lessonProgress: action.payload.lessonProgressId,
      vocabProgress: action.payload.vocabProgressId,
      convoProgress: action.payload.convoProgressId,
    };
  }
};

export default reducer;

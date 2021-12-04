import React, { useContext, useEffect, useReducer } from "react";
import reducer from "./reducer";
import { user as userData } from "./data/user.json";
import {
  lesson as lessonProgress,
  vocabulary as vocabProgress,
  conversation as convoProgress,
} from "./data/progress.json";
import { lessons as lessonsData } from "./data/lessons.json";

const AppContext = React.createContext();

const initState = {
  loading: true,
  user: null,
  lessonProgress: null,
  vocabProgress: null,
  convoProgress: null,
  lessonsData: null,
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initState);

  const fetchUser = (userData) => {
    dispatch({ type: "LOADING" });
    // const userDetailId = user[0].id;
    // const userDetailUsername = user[0].username;

    const user = userData[0];

    dispatch({
      type: "STORE_USER",
      payload: user,
    });
  };

  const fetchProgress = (lessonProgress, vocabProgress, convoProgress) => {
    const lessonProgressId = lessonProgress[0];
    const vocabProgressId = vocabProgress[0];
    const convoProgressId = convoProgress[0];

    dispatch({
      type: "STORE_PROGRESS",
      payload: { lessonProgressId, vocabProgressId, convoProgressId },
    });
  };

  const fetchAllLessons = (lessonsData) => {
    dispatch({ type: "STORE_LESSONS", payload: lessonsData });
  };

  useEffect(() => {
    // here to fetch userProgress: id = 1 here
    fetchUser(userData);
    fetchProgress(lessonProgress, vocabProgress, convoProgress);
    fetchAllLessons(lessonsData);
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        fetchUser,
        fetchProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };

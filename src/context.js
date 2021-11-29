import React, {
  useState,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import reducer from "./reducer";
import { lessons } from "./data";

const AppContext = React.createContext();

const initState = {
  userid: false,
  username: "Bob",
  lessonItems: lessons,
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <AppContext.Provider
      value={{
        ...state,
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

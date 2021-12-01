import React, { useContext, useEffect, useReducer } from "react";
import reducer from "./reducer";
import { users } from "./data/users.json";
// import { materials } from "./data/materials.json";

const AppContext = React.createContext();

const initState = {
  loading: true,
  user: null,
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initState);

  const fetchUser = (userid) => {
    dispatch({ type: "LOADING" });

    let user = users.find((userItem) => userItem.id === userid);
    console.log(user);
    dispatch({ type: "STORE_USER", payload: user });
  };

  // here to fetch userProgress: id = 1 here
  useEffect(() => {
    fetchUser(1);
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        fetchUser,
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

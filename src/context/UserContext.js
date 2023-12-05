import React from "react";
import { loginUserAPI } from "../api";
var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################

function signOut(dispatch, history) {
  localStorage.removeItem("id_token");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
function loginUser(dispatch, login, password, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);

  if (!!login && !!password) {
    console.log(login + " " + password);
    setTimeout(async () => {
      try {
        const loginData = await loginUserAPI(login, password);
        console.log(loginData);
        if (!!loginData) {
          localStorage.setItem("id_token", loginData.accessToken);
          localStorage.setItem("role", loginData.role);
          localStorage.setItem("user_id", loginData.id);
          localStorage.setItem("uni_id", loginData.uni_id);


          dispatch({ type: "LOGIN_SUCCESS" });
          setError(null);
          setIsLoading(false);
          history.push("tables");

        }
      } catch (err) {
        localStorage.removeItem("id_token");

        // dispatch({ type: "LOGIN_FAILURE" });
        setError(true);
        setIsLoading(false);
      }
    }, 2000);
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}
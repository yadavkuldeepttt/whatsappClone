import { createContext, useContext, useReducer } from "react";

export const StateContext = createContext();

export const StateProvider = ({ initialState, reducer, children }) => 
  // const [state, dispatch] = useReducer(reducer, initialState);
 (
    <StateContext.Provider value = {useReducer(reducer,initialState)}>
      {children}
    </StateContext.Provider>
  );

export const useStateProvider = () => useContext(StateContext);

import {useReducer, createContext} from 'react';
import reducer from './reducer'

export const Context = createContext();

const Store = (props) => {
  const [state, dispatch] = useReducer(reducer, {});

  return(
    <Context.Provider value={{state, dispatch}}>
      {props.children}
    </Context.Provider>
  );
}

export default Store;
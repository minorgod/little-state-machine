'use client'; // needed for Next 13 compatibility
import * as React from 'react';
import storeFactory from '../logic/storeFactory';
import { StateMachineContextValue } from '../types';
import { PERSIST_OPTION } from '../constants';

const StateMachineContext = React.createContext<StateMachineContextValue>(
  undefined as any,
);

export const StateMachineProvider = ({ children } : React.PropsWithChildren) => {
  const [state, setState] = React.useState(storeFactory.state);

  React.useEffect(() => {
    if (storeFactory.options.persist === PERSIST_OPTION.UNLOAD) {
      window.onbeforeunload = () => storeFactory.saveStore();
      storeFactory.options.storageType &&
        storeFactory.options.storageType.removeItem(storeFactory.options.name!);
    }
  }, []);

  return (
    <StateMachineContext.Provider value={{ state, setState }}>
      {children}
    </StateMachineContext.Provider>
  );
};

export const useStateMachineContext = () =>
  React.useContext<StateMachineContextValue>(StateMachineContext);
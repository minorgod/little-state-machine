import { StateMachineProvider } from './context';
import { createStore } from './logic/createStore';
import { useStateMachine } from './hooks';
import { useStateMachineContext } from './context';
export type { GlobalState } from './types';

export { createStore, StateMachineProvider, useStateMachine, useStateMachineContext};


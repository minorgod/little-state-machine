import storeFactory from './storeFactory';
import {
  StateMachineOptions,
  GlobalState,
} from '../types';

export function createStore(
  defaultState: GlobalState,
  options?: StateMachineOptions,
) {
  if (options) {
    storeFactory.options = {
      ...storeFactory.options,
      ...options,
    };
  }

  if (process.env.NODE_ENV !== 'production') {
    if (typeof window !== 'undefined') {
      window.__LSM_NAME__ = storeFactory.options.name;
      window.__LSM_RESET__ = () =>
        storeFactory.options.storageType &&
        storeFactory.options.storageType.removeItem(storeFactory.options.name!);
    }
  }

  storeFactory.updateStore(defaultState);
}

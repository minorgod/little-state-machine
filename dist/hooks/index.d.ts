import { ActionsOutput, AnyActions, AnyCallback, GlobalState } from "../types";
export declare function useStateMachine<TCallback extends AnyCallback, TActions extends AnyActions<TCallback>>(actions?: TActions): {
    actions: ActionsOutput<TCallback, TActions>;
    state: GlobalState;
    getState: () => GlobalState;
};

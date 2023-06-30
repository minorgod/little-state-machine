import {ActionsOutput, AnyActions, AnyCallback, GlobalState} from "../types";
import {useStateMachineContext} from "../context";
import * as React from "react";
import storeFactory from "../logic/storeFactory";
import {PERSIST_OPTION, STORE_ACTION_NAME} from "../constants";


const actionTemplate =
    <TCallback extends AnyCallback>(
        setState: React.Dispatch<React.SetStateAction<GlobalState>>,
        callback: TCallback,
    ) =>
        (payload: Parameters<TCallback>[1], options?: { skipRender: boolean }) => {
            if (process.env.NODE_ENV !== 'production') {
                window[STORE_ACTION_NAME] = callback.name;
            }

            storeFactory.state = callback(storeFactory.state, payload);

            if (storeFactory.options.middleWares) {
                storeFactory.state = storeFactory.options.middleWares.reduce(
                    (currentValue, currentFunction) =>
                        currentFunction(currentValue, callback.name, payload) || currentValue,
                    storeFactory.state,
                );
            }

            (!options || !options.skipRender) && setState(storeFactory.state);

            if (storeFactory.options.persist === PERSIST_OPTION.ACTION) {
                storeFactory.saveStore();
            }
        };
export function useStateMachine<
    TCallback extends AnyCallback,
    TActions extends AnyActions<TCallback>,
>(
    actions?: TActions,
): {
    actions: ActionsOutput<TCallback, TActions>;
    state: GlobalState;
    getState: () => GlobalState;
} {
    const { state, setState } = useStateMachineContext();
    const actionsRef = React.useRef(
        Object.entries(actions || {}).reduce(
            (previous, [key, callback]) =>
                Object.assign({}, previous, {
                    [key]: actionTemplate(setState, callback),
                }),
            {} as ActionsOutput<TCallback, TActions>,
        ),
    );

    return {
        actions: actionsRef.current,
        state,
        getState: React.useCallback(() => storeFactory.state, []),
    };
}

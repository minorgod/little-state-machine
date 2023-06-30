import React from "react";
import {render, waitFor} from "@testing-library/react";
import {StateMachineProvider} from ".";
import {useStateMachine} from "../hooks";
import type {GlobalState} from "../types";
import {createStore} from "../logic/createStore";
import userEvent from '@testing-library/user-event';

const updateState = (state: GlobalState, payload: Record<string, any>) => ({...state, ...payload})

const TestComponent = () => {
    const {state, actions} = useStateMachine({
        updateState
    });


    return <>
        <input type={'button'} onClick={() => actions.updateState({testProp: 'true'})} value={'Test Button'}/>
        <div data-testid={'value'}>
            {/*@ts-ignore*/}
            {state.testProp}
        </div>
    </>

}

beforeEach(() => {
    //set the initial value of our testProp to false before each test
    createStore({testProp: 'false'}, {name: 'test', persist: 'none'});
});
describe('Test', () => {
    it('should render', async () => {
        const user = userEvent.setup();
        const {getByText, getByTestId} = render(<StateMachineProvider><TestComponent/></StateMachineProvider>);

        const value = getByTestId('value');
        expect(value).toHaveTextContent('false');

        await user.click(getByText('Test Button'));
        await waitFor(() => expect(value).toHaveTextContent('true'));
    });
});

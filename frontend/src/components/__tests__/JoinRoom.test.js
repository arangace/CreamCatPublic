import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import JoinRoomPage from '../JoinRoom';
import {AppContext} from '../../AppContextProvider';

it('handles adding to form and sending data on button click', async() =>{
    const dummyJoinRoom = jest.fn();

    render(
        <AppContext.Provider value={{joinRoom: dummyJoinRoom}}>
            <JoinRoomPage />
        </AppContext.Provider>
    )

   act(()=>{
        const joinButton = screen.getByText('Join')
        fireEvent.click(joinButton)
    }) 

    await waitFor(()=>screen.queryByText('Room ID is required!'))

    expect(screen.queryByText('Room ID is required!'))
    expect(dummyJoinRoom).toHaveBeenCalledTimes(0);
    
    const name = screen.getByPlaceholderText('Room ID');
    userEvent.type(name, 'test')

    const desc = screen.getByPlaceholderText('Password');
    userEvent.type(desc, 'testPass')

    act(()=>{
        const joinButton = screen.getByText('Join')
        fireEvent.click(joinButton)
    })

    expect(dummyJoinRoom).toHaveBeenCalledTimes(1);
    const room = dummyJoinRoom.mock.calls[0][0];

})

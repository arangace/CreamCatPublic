import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import NavBar from '../NavBar';
import {AppContext} from '../../AppContextProvider';

it('checks links are rendered in NavBar', async() =>{
    const dummyRoom = {
        name: "test Room",
        password: ""
    };
    render(
        <AppContext.Provider value={{currentRoom: false}}>
            <NavBar/>
        </AppContext.Provider>
    )

    expect(screen.queryByText('CreamCat')).not.toBeNull();
    expect(screen.queryByText('Join Room')).not.toBeNull();
    expect(screen.queryByText('Create Room')).not.toBeNull();

    render(
        <AppContext.Provider value={{currentRoom: dummyRoom}}>
            <NavBar/>
        </AppContext.Provider>
    )

    expect(screen.queryByText('test Room')).not.toBeNull();
    expect(screen.queryByText('Leave Room')).not.toBeNull();

})
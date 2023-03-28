import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {AppContext} from '../../../AppContextProvider';
import Header from '../Header';


it('check if components are rendered', async() =>{
    const dummyCrurrentRoom = {
        _id: '6095866c9a1d704440e7113f',
        name: 'test room'
    }

    render(
        <AppContext.Provider value={{currentRoom: dummyCrurrentRoom}}>
            <Header/>
        </AppContext.Provider>
    )

    expect(screen.queryByText('Room ID: 6095866c9a1d704440e7113f')).not.toBeNull();
    expect(screen.queryByText('test room')).not.toBeNull();
    const searchbar = screen.queryByText('Search')
    expect(searchbar).toBeInTheDocument()
})
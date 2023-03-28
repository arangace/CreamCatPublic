import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';
import {AppContext} from '../../AppContextProvider';

it('checking that the search button works', async() =>{
    const dummyRoom = {
        name: "test Room",
        password: "testPassword"
    }

    const dummy = jest.fn();

    render(
        <AppContext.Provider value={{currentRoom: dummyRoom}}>
            <SearchBar handleSubmit={dummy}/>
        </AppContext.Provider>
    )
    
    const search = screen.getByPlaceholderText('Search');
    userEvent.type(search, 'Test Song')

    const searchButton = screen.getByText('Search')
    fireEvent.click(searchButton)

    expect(screen.queryByText('Test Song'));
})

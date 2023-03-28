import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {AppContext} from '../../../AppContextProvider';
import Playlist from '../Playlist';

it('checks if playlist is rendered', async() =>{
    const { dummySetPlaylist, dummySetCurrentSong, dummySetPlaying } = jest.fn()

    const dummyCurrentRoom = {
        _id: 'room1',
        name: 'room1',
        password: 'password'
    };
    render(
        <AppContext.Provider value={{setPlaylist: dummySetPlaylist}, {setPlaying: dummySetPlaying},
                        {setCurrentSong: dummySetCurrentSong}, {currentRoom: dummyCurrentRoom}}>
            <Playlist/>
        </AppContext.Provider>
    );

    expect(screen.queryByText('Don\'t you think it\'s a bit quiet..? Try adding a song!')).not.toBeNull();

})
import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {AppContext} from '../../../AppContextProvider';
import Playbar from '../Playbar';


it('checks if components are rendered', async() =>{
    const { dummySocket, dummySetPlaying,  dummySetElapsedTime } = jest.fn()

    render(
        <AppContext.Provider value={{socket: dummySocket}, {setPlaying: dummySetPlaying}, {setElapsedTime: dummySetElapsedTime}}>
            <Playbar/>
        </AppContext.Provider>
    )

    expect(screen.queryByText('No song in queue...')).not.toBeNull();
    expect(screen.queryByText('Try adding a song from the search bar!')).not.toBeNull();
})

it('checks if songs are properly displayed', async() =>{
    const { dummySocket, dummySetPlaying,  dummySetElapsedTime } = jest.fn()
    const dummyCurrentSong = {
        title: 'song1',
        content: 'www.youtube.com'
    }
    render(
        <AppContext.Provider value={{socket: dummySocket}, {setPlaying: dummySetPlaying}, {setElapsedTime: dummySetElapsedTime}, {currentSong: dummyCurrentSong}}>
            <Playbar/>
        </AppContext.Provider>
    )

    expect(screen.queryByText('song1')).not.toBeNull();
    expect(screen.queryByText('www.youtube.com')).not.toBeNull();
    expect(screen.getByTestId('playbar')).not.toBeNull();
})
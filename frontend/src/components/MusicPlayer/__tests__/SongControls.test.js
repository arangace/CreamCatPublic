import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {AppContext} from '../../../AppContextProvider';
import SongControls from '../SongControls';

it('checks buttons', async() =>{
    const {dummySocket, dummySetVoteSkip, dummySetDisplayNoCurrentSongAlert,} = jest.fn()
    {/*
        currentRoom,
        playing,
        voteSkip,
        currentSong
    */}

    render(
        <AppContext.Provider value={{socket: dummySocket}, {setVoteSkip: dummySetVoteSkip}, {setDisplayNoCurrentSongAlert: dummySetDisplayNoCurrentSongAlert}}>
            <SongControls/>
        </AppContext.Provider>
    );

    expect(screen.queryByTestId('play')).not.toBeNull();
    expect(screen.queryByTestId('skip')).not.toBeNull();


})
import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {AppContext} from '../../../AppContextProvider';
import SongInfo from '../SongInfo';

it('check if song is rendered', async() =>{
    const dummySong = {
        roomID: '6095866c9a1d704440e7113f',
        title: 'test Song',
        content: 'https://www.youtube.com/watch?v=_pLO4jFDeIc'
    }

    render(
        <AppContext.Provider value={{currentSong: dummySong}}>
            <SongInfo/>
        </AppContext.Provider>
    )

    expect(screen.queryByText('test Song')).not.toBeNull();

})
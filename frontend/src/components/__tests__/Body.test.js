import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Body from '../Body';


it('checks everything renders and links work', async() =>{
    const dummyButton = jest.fn();
    render(<Body />)
    expect(screen.queryByText('The best collaborative music web application out there!')).not.toBe(null);
    expect(screen.queryByText('Extensive library to search for any song and listen together with your friends!')).not.toBe(null);
    expect(screen.getByText('Start')).toHaveAttribute('href', 'RoomPage')
})
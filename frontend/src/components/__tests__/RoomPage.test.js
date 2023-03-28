import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import RoomPage from '../RoomPage';

it('checks everything renders and links work', async() =>{
    const dummyCreateRoom = jest.fn();

    render(<RoomPage/>)
    expect(screen.getByText('Join Room')).toHaveAttribute('href', 'JoinRoom')
    expect(screen.getByText('Create Room')).toHaveAttribute('href', 'CreateRoom')
})
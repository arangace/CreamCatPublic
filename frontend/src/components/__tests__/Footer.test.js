import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Footer from '../Footer';


it('checks everything renders', async() =>{
    render(<Footer/>)
    expect(screen.queryByText('https://github.com/arangace/CreamCat')).not.toBe(null);
    expect(screen.queryByText('About')).not.toBe(null);
    expect(screen.queryByText('Support')).not.toBe(null);
    expect(screen.queryByText('Useful links')).not.toBe(null);
})
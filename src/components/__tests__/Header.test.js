import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react'; // Updated import
import Header from '../Header';

test('renders Header component', async () => {
    await act(async () => {
        render(<Header />);
    });
    
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
});

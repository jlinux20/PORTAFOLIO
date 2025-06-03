import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Header from '../Header';

test('renders Header component', () => {
  render(<Header />);
  const headerElement = screen.getByRole('banner');
  expect(headerElement).toBeInTheDocument();
});

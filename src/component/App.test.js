import * as React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders title', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Spotiguess/i);
  expect(linkElement).toBeInTheDocument();
});

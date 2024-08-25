// __tests__/Grid.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import GridComponent from '../components/Grid';
import '@testing-library/jest-dom';

test('renders and interacts with grid', () => {
  // Render the GridComponent with the required prop
  render(<GridComponent currentPage={1} />);

  // Find an input element within the grid
  const input = screen.getByRole('textbox');
  
  // Check if the input is in the document
  expect(input).toBeInTheDocument();
  
  // Change the value of the input
  fireEvent.change(input, { target: { value: 'test' } });

  // Check if the input value has changed
  expect(input).toHaveValue('test');
});



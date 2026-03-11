import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Meal Attendance System/i);
  expect(headerElement).toBeInTheDocument();
});

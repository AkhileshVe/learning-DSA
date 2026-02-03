import { render, screen } from '@testing-library/react';
import App from './App';

test('renders snake section', () => {
  render(<App />);
  const title = screen.getByText(/snake/i);
  expect(title).toBeInTheDocument();
});

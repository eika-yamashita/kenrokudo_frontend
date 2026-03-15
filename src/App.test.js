import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home page heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/育成情報を、見やすく整えて/i);
  expect(headingElement).toBeInTheDocument();
});

import { render, screen } from '@testing-library/react';

let mockPathname = '/';

jest.mock('react-router-dom', () => {
  const React = require('react');

  return {
    __setMockPathname: (pathname) => {
      mockPathname = pathname;
    },
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Routes: ({ children }) => <>{React.Children.toArray(children)[0]}</>,
    Route: ({ element }) => element,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
    useLocation: () => ({ pathname: mockPathname }),
  };
}, { virtual: true });

import App from './App';
import { __setMockPathname } from 'react-router-dom';

beforeEach(() => {
  __setMockPathname('/');
});

test('renders home page hero', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /KENROKUDO/i })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /Leopard gecko portrait/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /KENROKUDO/i })).toHaveAttribute('href', '/');
});

test('admin header title routes to admin top', () => {
  __setMockPathname('/admin/individuals');
  render(<App />);
  expect(screen.getByRole('link', { name: /KENROKUDO/i })).toHaveAttribute('href', '/admin');
});

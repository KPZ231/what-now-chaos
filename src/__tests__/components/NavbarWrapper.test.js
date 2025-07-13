import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavbarWrapper from '../../app/components/NavbarWrapper';

// Mock Navbar component
jest.mock('../../app/partial/navbar', () => {
  return function MockedNavbar({ isLoading, isAuthenticated, user, showUserMenu, setShowUserMenu, handleLogout }) {
    return (
      <div data-testid="mocked-navbar">
        <span data-testid="loading-status">{String(isLoading)}</span>
        <span data-testid="auth-status">{String(isAuthenticated)}</span>
        <span data-testid="user-menu-status">{String(showUserMenu)}</span>
        <button data-testid="toggle-menu" onClick={() => setShowUserMenu(!showUserMenu)}>Toggle Menu</button>
        <button data-testid="logout-btn" onClick={handleLogout}>Logout</button>
        {user && <span data-testid="user-name">{user.name || user.email}</span>}
      </div>
    );
  };
});

// Mock AuthContext
jest.mock('../../lib/AuthContext', () => ({
  useAuth: jest.fn()
}));

describe('NavbarWrapper Component', () => {
  const mockLogout = jest.fn().mockResolvedValue();
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Default mock implementation
    const { useAuth } = require('../../lib/AuthContext');
    useAuth.mockReturnValue({
      user: { name: 'Test User', email: 'test@example.com' },
      isLoading: false,
      isAuthenticated: true,
      logout: mockLogout
    });
  });
  
  test('renders Navbar with correct props from AuthContext', () => {
    render(<NavbarWrapper>Test content</NavbarWrapper>);
    
    // Check props passed to Navbar
    expect(screen.getByTestId('loading-status').textContent).toBe('false');
    expect(screen.getByTestId('auth-status').textContent).toBe('true');
    expect(screen.getByTestId('user-name').textContent).toBe('Test User');
  });
  
  test('toggles user menu', () => {
    render(<NavbarWrapper>Test content</NavbarWrapper>);
    
    // Initially user menu should be hidden
    expect(screen.getByTestId('user-menu-status').textContent).toBe('false');
    
    // Click toggle button
    fireEvent.click(screen.getByTestId('toggle-menu'));
    
    // User menu should now be visible
    expect(screen.getByTestId('user-menu-status').textContent).toBe('true');
  });
  
  test('handles logout', async () => {
    render(<NavbarWrapper>Test content</NavbarWrapper>);
    
    // Click logout button
    fireEvent.click(screen.getByTestId('logout-btn'));
    
    // Check if logout function was called
    expect(mockLogout).toHaveBeenCalled();
  });
  
  test('renders children content', () => {
    render(
      <NavbarWrapper>
        <div data-testid="child-content">Child content</div>
      </NavbarWrapper>
    );
    
    // Check if child content is rendered
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });
}); 
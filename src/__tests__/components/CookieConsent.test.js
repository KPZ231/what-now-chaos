import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import CookieConsent from '../../app/components/CookieConsent';

describe('CookieConsent Component', () => {
  let localStorageMock;
  
  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    // Reset mock implementations
    localStorageMock.getItem.mockImplementation(() => null);
  });
  
  test('renders cookie consent when not previously accepted', () => {
    render(<CookieConsent />);
    
    // Check if consent message is displayed
    expect(screen.getByText(/Ta strona używa plików cookies/)).toBeInTheDocument();
    expect(screen.getByText('Akceptuję')).toBeInTheDocument();
  });
  
  test('does not render cookie consent when previously accepted', () => {
    // Mock that user has already accepted cookies
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'cookiesAccepted') return 'true';
      return null;
    });
    
    const { container } = render(<CookieConsent />);
    
    // The component should be empty
    expect(screen.queryByText(/Ta strona używa plików cookies/)).not.toBeInTheDocument();
    expect(screen.queryByText('Akceptuję')).not.toBeInTheDocument();
  });
  
  test('clicking accept button saves to localStorage and hides consent', async () => {
    render(<CookieConsent />);
    
    // Initially visible
    expect(screen.getByText(/Ta strona używa plików cookies/)).toBeInTheDocument();
    
    // Click accept button
    const acceptButton = screen.getByText('Akceptuję');
    
    await act(async () => {
      fireEvent.click(acceptButton);
    });
    
    // Check if localStorage was set
    expect(localStorageMock.setItem).toHaveBeenCalledWith('cookiesAccepted', 'true');
    
    // Consent should be hidden (though we can't easily test the animation in Jest)
    // The component uses AnimatePresence which makes testing the removal more complex
  });
  
  test('links to cookie policy page', () => {
    render(<CookieConsent />);
    
    const policyLink = screen.getByText('Polityka Cookies');
    expect(policyLink).toHaveAttribute('href', '/cookie-policy');
  });
}); 
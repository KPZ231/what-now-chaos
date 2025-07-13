import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../app/page';

// Mock the framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

// Mock the components
jest.mock('../../app/partial/navbar', () => {
  return function MockedNavbar() {
    return <div data-testid="mocked-navbar">Mocked Navbar</div>;
  };
});

jest.mock('../../app/partial/footer', () => {
  return function MockedFooter() {
    return <div data-testid="mocked-footer">Mocked Footer</div>;
  };
});

jest.mock('../../lib/SEO', () => {
  return function MockedSEO() {
    return <div data-testid="mocked-seo">Mocked SEO</div>;
  };
});

jest.mock('../../app/components/AdComponent', () => {
  return function MockedAdComponent({ adSlot, adFormat }) {
    return <div data-testid={`ad-${adSlot}`} data-format={adFormat}>Mocked Ad</div>;
  };
});

// Mock AuthContext
jest.mock('../../lib/AuthContext', () => ({
  useAuth: jest.fn().mockReturnValue({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    logout: jest.fn().mockResolvedValue(),
  }),
}));

describe('Home Page Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = '/'; // Reset location
  });

  test('renders the home page with main components', () => {
    render(<Home />);
    
    // Check for main section headings and components
    expect(screen.getByText(/Generator Imprezowego Chaosu/i)).toBeInTheDocument();
    expect(screen.getByText(/Ożyw swoją imprezę/i)).toBeInTheDocument();
    expect(screen.getByTestId('mocked-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('mocked-footer')).toBeInTheDocument();
    expect(screen.getByTestId('mocked-seo')).toBeInTheDocument();
    
    // Check for call to action buttons
    const startButtons = screen.getAllByText('Rozpocznij Zabawę');
    expect(startButtons.length).toBeGreaterThan(0);
    expect(screen.getByText('Zobacz Tryby Gry')).toBeInTheDocument();
  });
  
  test('renders game modes section', () => {
    render(<Home />);
    
    // Check for all game modes
    expect(screen.getByText('Soft')).toBeInTheDocument();
    expect(screen.getByText('Chaos')).toBeInTheDocument();
    expect(screen.getByText('Hardcore')).toBeInTheDocument();
    expect(screen.getByText('Quick')).toBeInTheDocument();
    
    // Check for mode descriptions
    expect(screen.getByText(/Łagodne i bezpieczne wyzwania/i)).toBeInTheDocument();
    expect(screen.getByText(/Szalone i kreatywne zadania/i)).toBeInTheDocument();
    expect(screen.getByText(/Odważne i wyzywające zadania/i)).toBeInTheDocument();
    expect(screen.getByText(/Szybkie zadania/i)).toBeInTheDocument();
  });
  
  test('changes active mode when clicking on mode cards', () => {
    render(<Home />);
    
    // Default should be "chaos" mode
    const chaosCard = screen.getByText(/Szalone i kreatywne zadania/i).closest('div');
    expect(chaosCard.className).toContain('border-[var(--primary)]');
    
    // Click on Soft mode
    const softModeCard = screen.getByText('Soft').closest('div');
    fireEvent.click(softModeCard);
    
    // Now Soft should be active
    expect(softModeCard.className).toContain('border-[var(--primary)]');
    expect(chaosCard.className).not.toContain('border-[var(--primary)]');
  });
  
  test('renders features section with four features', () => {
    render(<Home />);
    
    expect(screen.getByText('Różne Tryby Gry')).toBeInTheDocument();
    expect(screen.getByText('Licznik i Powiadomienia')).toBeInTheDocument();
    expect(screen.getByText('Historia Sesji')).toBeInTheDocument();
    expect(screen.getByText('Raport z Imprezy')).toBeInTheDocument();
  });
  
  test('renders advertisement components for non-premium users', () => {
    render(<Home />);
    
    expect(screen.getByTestId('ad-1234567890')).toBeInTheDocument();
    expect(screen.getByTestId('ad-0987654321')).toBeInTheDocument();
    expect(screen.getByTestId('ad-0987654321').getAttribute('data-format')).toBe('rectangle');
  });
  
  test('renders register link for non-authenticated users', () => {
    // Mock non-authenticated user
    const { useAuth } = require('../../lib/AuthContext');
    useAuth.mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      logout: jest.fn(),
    });
    
    render(<Home />);
    
    expect(screen.getByText('Zarejestruj się za darmo')).toBeInTheDocument();
  });
  
  test('does not render register link for authenticated users', () => {
    // Mock authenticated user
    const { useAuth } = require('../../lib/AuthContext');
    useAuth.mockReturnValue({
      user: { name: 'Test User' },
      isLoading: false,
      isAuthenticated: true,
      logout: jest.fn(),
    });
    
    render(<Home />);
    
    expect(screen.queryByText('Zarejestruj się za darmo')).not.toBeInTheDocument();
  });
}); 
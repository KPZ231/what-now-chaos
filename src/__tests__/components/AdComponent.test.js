import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdComponent from '../../app/components/AdComponent';

// Mock AuthContext
jest.mock('../../lib/AuthContext', () => ({
  useAuth: jest.fn().mockReturnValue({
    user: null
  })
}));

describe('AdComponent', () => {
  let mockAdsByGoogle;
  
  beforeEach(() => {
    // Mock window.adsbygoogle
    mockAdsByGoogle = [];
    Object.defineProperty(window, 'adsbygoogle', {
      value: mockAdsByGoogle,
      writable: true
    });
  });
  
  test('renders ad for non-premium users', () => {
    const { useAuth } = require('../../lib/AuthContext');
    useAuth.mockReturnValue({ user: { isPremium: false } });
    
    render(<AdComponent adSlot="test-slot" />);
    
    // Check ad container is rendered
    expect(screen.getByText(/Reklama - przejdź na wersję Premium/)).toBeInTheDocument();
    
    // Check adsbygoogle ins element exists
    const adElement = document.querySelector('.adsbygoogle');
    expect(adElement).toBeInTheDocument();
    
    // Check ad attributes
    expect(adElement).toHaveAttribute('data-ad-slot', 'test-slot');
    expect(adElement).toHaveAttribute('data-ad-format', 'auto');
  });
  
  test('renders ad with custom format', () => {
    const { useAuth } = require('../../lib/AuthContext');
    useAuth.mockReturnValue({ user: { isPremium: false } });
    
    render(<AdComponent adSlot="test-slot" adFormat="horizontal" />);
    
    // Check ad format attribute
    const adElement = document.querySelector('.adsbygoogle');
    expect(adElement).toHaveAttribute('data-ad-format', 'horizontal');
  });
  
  test('does not render ad for premium users', () => {
    const { useAuth } = require('../../lib/AuthContext');
    useAuth.mockReturnValue({ user: { isPremium: true } });
    
    const { container } = render(<AdComponent adSlot="test-slot" />);
    
    // Check that the ad container is not rendered
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText(/Reklama/)).not.toBeInTheDocument();
  });
  
  test('calls adsbygoogle.push when rendered', () => {
    const { useAuth } = require('../../lib/AuthContext');
    useAuth.mockReturnValue({ user: { isPremium: false } });
    
    // Spy on Array.prototype.push
    const pushSpy = jest.spyOn(Array.prototype, 'push');
    
    render(<AdComponent adSlot="test-slot" />);
    
    // Check that adsbygoogle.push was called
    expect(pushSpy).toHaveBeenCalled();
    
    pushSpy.mockRestore();
  });
}); 
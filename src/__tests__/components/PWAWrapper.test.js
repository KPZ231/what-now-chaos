import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PWAWrapper from '../../app/components/PWAWrapper';

// Mock the dynamic import of InstallPWA
jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => <div data-testid="mock-install-pwa">Mocked InstallPWA</div>;
  DynamicComponent.displayName = 'InstallPWA';
  return DynamicComponent;
});

describe('PWAWrapper Component', () => {
  test('renders the InstallPWA component dynamically', () => {
    const { getByTestId } = render(<PWAWrapper />);
    expect(getByTestId('mock-install-pwa')).toBeInTheDocument();
  });
}); 
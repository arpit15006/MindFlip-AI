import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnimatedFlashcard } from '../AnimatedFlashcard';

describe('AnimatedFlashcard', () => {
  const mockOnClick = jest.fn();
  
  beforeEach(() => {
    mockOnClick.mockClear();
  });
  
  test('renders front content when not flipped', () => {
    render(
      <AnimatedFlashcard
        frontContent="Front Content"
        backContent="Back Content"
        isFlipped={false}
        onClick={mockOnClick}
      />
    );
    
    expect(screen.getByText('Front Content')).toBeInTheDocument();
    expect(screen.queryByText('Back Content')).not.toBeVisible();
  });
  
  test('renders back content when flipped', () => {
    render(
      <AnimatedFlashcard
        frontContent="Front Content"
        backContent="Back Content"
        isFlipped={true}
        onClick={mockOnClick}
      />
    );
    
    expect(screen.getByText('Back Content')).toBeInTheDocument();
    expect(screen.queryByText('Front Content')).not.toBeVisible();
  });
  
  test('calls onClick when clicked', () => {
    render(
      <AnimatedFlashcard
        frontContent="Front Content"
        backContent="Back Content"
        isFlipped={false}
        onClick={mockOnClick}
      />
    );
    
    fireEvent.click(screen.getByText('Front Content'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
  
  test('displays status indicator when status is provided', () => {
    render(
      <AnimatedFlashcard
        frontContent="Front Content"
        backContent="Back Content"
        isFlipped={false}
        status="known"
      />
    );
    
    const statusIndicator = document.querySelector('[title="Status: Known"]');
    expect(statusIndicator).toBeInTheDocument();
  });
  
  test('applies feedback styles when feedback is provided', () => {
    render(
      <AnimatedFlashcard
        frontContent="Front Content"
        backContent="Back Content"
        isFlipped={false}
        feedback="known"
      />
    );
    
    // Check that the component has the appropriate animation variant applied
    const container = screen.getByText('Front Content').closest('div');
    expect(container).toHaveAttribute('data-motion-state', 'known');
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/Button';

describe('Button Component', () => {
  it('renders with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText(/Click Me/i)).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText(/Click Me/i));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies the correct className', () => {
    render(<Button className="test-class">Click Me</Button>);
    expect(screen.getByText(/Click Me/i)).toHaveClass('test-class');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled={true}>Click Me</Button>);
    expect(screen.getByText(/Click Me/i)).toBeDisabled();
  });
});

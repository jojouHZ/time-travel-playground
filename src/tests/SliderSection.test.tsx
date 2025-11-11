import React from 'react';
import { render, screen } from '@testing-library/react';
import SliderSection from '../components/SliderSection';

jest.mock('rc-slider', () => ({
  __esModule: true,
  default: ({ marks }: { marks: Record<number, string> }) => (
    <div data-testid="slider">
      {Object.entries(marks).map(([key, value]) => (
        <div key={key}>{value}</div>
      ))}
    </div>
  ),
}));

describe('SliderSection Component', () => {
  it('renders the slider with correct marks', () => {
    const mockProps = {
      historyLength: 3,
      currentIndex: 1,
      onChange: jest.fn(),
    };
    render(<SliderSection {...mockProps} />);
    expect(screen.getByTestId('slider')).toHaveTextContent('Start');
    expect(screen.getByTestId('slider')).toHaveTextContent('1');
    expect(screen.getByTestId('slider')).toHaveTextContent('2');
    expect(screen.getByTestId('slider')).toHaveTextContent('Current');
  });
});

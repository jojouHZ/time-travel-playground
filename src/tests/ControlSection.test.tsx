import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ControlsSection from '../components/ControlsSection';

describe('ControlsSection Component', () => {
  const mockProps = {
    onClearHistory: jest.fn(),
    onSaveSnapshot: jest.fn(),
    onGoBack: jest.fn(),
    onGoForward: jest.fn(),
    onLoadSnapshot: jest.fn(),
    onOpenDiffViewer: jest.fn(),
    dbInitialized: true,
    historyLength: 3,
    currentIndex: 1,
  };

  it('renders all buttons', () => {
    render(<ControlsSection {...mockProps} />);
    expect(screen.getByText(/Clear History/i)).toBeInTheDocument();
    expect(screen.getByText(/Save Snapshot/i)).toBeInTheDocument();
    expect(screen.getByText(/Back/i)).toBeInTheDocument();
    expect(screen.getByText(/Forward/i)).toBeInTheDocument();
    expect(screen.getByText(/Load Snapshot/i)).toBeInTheDocument();
    expect(screen.getByText(/Diff Viewer/i)).toBeInTheDocument();
  });

  it('calls onClearHistory when Clear History button is clicked', () => {
    render(<ControlsSection {...mockProps} />);
    fireEvent.click(screen.getByText(/Clear History/i));
    expect(mockProps.onClearHistory).toHaveBeenCalledTimes(1);
  });

  it('disables Save Snapshot button when dbInitialized is false', () => {
    render(<ControlsSection {...mockProps} dbInitialized={false} />);
    expect(screen.getByText(/Save Snapshot/i)).toBeDisabled();
  });
});

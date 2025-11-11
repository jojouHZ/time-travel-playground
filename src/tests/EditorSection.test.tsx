import React from 'react';
import { render, screen } from '@testing-library/react';
import EditorSection from '../components/EditorSection';

jest.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({ value }: { value: string }) => (
    <div data-testid="editor">{value}</div>
  ),
}));

describe('EditorSection Component', () => {
  it('renders the editor with the correct value', () => {
    const mockCode = 'console.log("Hello, World!");';
    render(<EditorSection code={mockCode} onChange={jest.fn()} />);
    expect(screen.getByTestId('editor')).toHaveTextContent(mockCode);
  });
});

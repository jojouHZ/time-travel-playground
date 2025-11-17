import React from 'react';
import Button from './Button';
import {
  FaSave,
  FaStepBackward,
  FaStepForward,
  FaCode,
  FaTimes,
} from 'react-icons/fa';

interface ControlsSectionProps {
  onClearHistory: () => void;
  onSaveSnapshot: () => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onLoadSnapshot: () => void;
  onOpenDiffViewer: () => void;
  dbInitialized: boolean;
  historyLength: number;
  currentIndex: number;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const ControlsSection: React.FC<ControlsSectionProps> = ({
  onClearHistory,
  onSaveSnapshot,
  onGoBack,
  onGoForward,
  onLoadSnapshot,
  onOpenDiffViewer,
  dbInitialized,
  historyLength,
  currentIndex,
  inputRef,
}) => {
  return (
    <section>
      <Button
        onClick={onClearHistory}
        disabled={historyLength === 0}
        className="control-button"
      >
        <FaTimes /> Clear History
      </Button>
      <Button
        onClick={onSaveSnapshot}
        disabled={!dbInitialized}
        className="control-button"
      >
        <FaSave /> Save Snapshot
      </Button>
      <Button
        onClick={onGoBack}
        disabled={currentIndex <= 0}
        className="control-button"
      >
        <FaStepBackward /> Back
      </Button>
      <Button
        onClick={onGoForward}
        disabled={currentIndex >= historyLength - 1 || currentIndex === -1}
        className="control-button"
      >
        <FaStepForward /> Forward
      </Button>
      <div>
        <input
          ref={inputRef}
          id="input-value"
          type="number"
          placeholder="0+"
          min="0"
          className="snapshot-input"
        />
        <Button onClick={onLoadSnapshot} className="control-button">
          Load Snapshot
        </Button>
      </div>
      <Button
        onClick={onOpenDiffViewer}
        disabled={historyLength < 1}
        className="control-button"
      >
        <FaCode /> Diff Viewer
      </Button>
    </section>
  );
};

export default ControlsSection;

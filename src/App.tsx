import React, { useState, useEffect } from 'react';
import { useHistory } from './context/HistoryContext';
import { openDB, getAllSnapshots, closeDB } from './utils/indexedDB';
import { Snapshot } from './types/Snapshot';
import EditorSection from './components/EditorSection';
import ControlsSection from './components/ControlsSection';
import SliderSection from './components/SliderSection';
import { DiffViewer } from './components/DiffViewer';

const App = () => {
  const defaultMessage = '// Write your JavaScript code here...';
  const [code, setCode] = useState<string>(defaultMessage);
  const [currentCode, setCurrentCode] = useState<string>(defaultMessage);
  const [dbInitialized, setDbInitialized] = useState<boolean>(false);
  const [isDiffViewerOpen, setIsDiffViewerOpen] = useState<boolean>(false);
  const [leftSnapshotIndex, setLeftSnapshotIndex] = useState<number | null>(
    null
  );
  const [rightSnapshotIndex, setRightSnapshotIndex] = useState<number>(-1);
  const {
    history,
    currentIndex,
    addSnapshot,
    clearHistory,
    goBack,
    goForward,
    loadSnapshot,
    saveSnapshot,
  } = useHistory();

  useEffect(() => {
    const initDB = async () => {
      try {
        await openDB();
        const snapshots = await getAllSnapshots();
        snapshots.forEach((snapshot: Snapshot) => addSnapshot(snapshot));
        if (snapshots.length > 0) {
          setCurrentCode(snapshots[snapshots.length - 1].code);
          setCode(snapshots[snapshots.length - 1].code);
        }
        setDbInitialized(true);
      } catch (error) {
        console.error('Error initializing IndexedDB:', error);
      }
    };
    initDB();
    return () => {
      closeDB();
    };
  }, []);

  useEffect(() => {
    if (currentIndex === -1) {
      setCode(currentCode);
    } else if (currentIndex >= 0 && history.length > 0) {
      setCode(history[currentIndex].code);
    }
  }, [currentIndex, history, currentCode]);

  const handleEditorChange = (newValue: string = '') => {
    setCode(newValue);
    setCurrentCode(newValue);
  };

  const handleLoadSnapshot = () => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const inputValue = inputRef.current
      ? parseInt(inputRef.current.value || '0')
      : 0;
    loadSnapshot(inputValue);
  };

  const handleOpenDiffViewer = () => {
    setIsDiffViewerOpen(true);
    if (history.length > 0) {
      setLeftSnapshotIndex(history.length - 1);
    }
    setRightSnapshotIndex(-1);
  };

  return (
    <>
      <header>
        <h1 className="app-title">Time Travel Playground</h1>
      </header>
      <EditorSection code={code} onChange={handleEditorChange} />
      <ControlsSection
        onClearHistory={clearHistory}
        onSaveSnapshot={() => saveSnapshot(currentCode)}
        onGoBack={goBack}
        onGoForward={goForward}
        onLoadSnapshot={handleLoadSnapshot}
        onOpenDiffViewer={handleOpenDiffViewer}
        dbInitialized={dbInitialized}
        historyLength={history.length}
        currentIndex={currentIndex}
      />
      {isDiffViewerOpen && leftSnapshotIndex !== null && (
        <DiffViewer
          oldCode={history[leftSnapshotIndex].code}
          newCode={
            rightSnapshotIndex === -1
              ? currentCode
              : history[rightSnapshotIndex].code
          }
          onClose={() => setIsDiffViewerOpen(false)}
        />
      )}
      <SliderSection
        historyLength={history.length}
        currentIndex={currentIndex}
        onChange={(newIndex: number | number[]) => {
          if (typeof newIndex === 'number') {
            if (newIndex === history.length) {
              loadSnapshot(history.length);
            } else {
              loadSnapshot(newIndex);
            }
          }
        }}
      />
    </>
  );
};

export default App;

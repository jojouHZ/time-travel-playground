import React, { useState, useEffect } from 'react';
import { useHistory } from './context/HistoryContext';
import EditorSection from './components/EditorSection';
import ControlsSection from './components/ControlsSection';
import SliderSection from './components/SliderSection';
import { DiffViewer } from './components/DiffViewer/DiffViewer';
import { useEditor } from './hooks/useEditor';
import {
  initializeDBAndFetchSnapshots,
  closeDatabase,
} from './utils/fetchSnapshots';
import { useSnapshotHandlers, useSnapshotNavigation } from './hooks/codeHooks';
import { TestComponent } from './components/TestComponent';

const App = () => {
  const defaultMessage = '// Write your JavaScript code here...';
  const { code, setCode, currentCode, setCurrentCode, handleEditorChange } =
    useEditor(defaultMessage);
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

  useSnapshotNavigation(currentIndex, history, currentCode, setCode);

  const { inputRef, handleLoadSnapshot, handleOpenDiffViewer } =
    useSnapshotHandlers(
      loadSnapshot,
      history,
      setIsDiffViewerOpen,
      setLeftSnapshotIndex,
      setRightSnapshotIndex
    );

  useEffect(() => {
    initializeDBAndFetchSnapshots(
      addSnapshot,
      setCurrentCode,
      setCode,
      setDbInitialized
    );
    return () => {
      closeDatabase();
    };
  }, []);

  const handleSliderChange = (newIndex: number | number[]) => {
    if (typeof newIndex === 'number') {
      if (newIndex === history.length) {
        loadSnapshot(history.length);
      } else {
        loadSnapshot(newIndex);
      }
    }
  };

  const handleFreshCode = () => {
    return rightSnapshotIndex === -1
      ? currentCode
      : history[rightSnapshotIndex].code;
  };

  return (
    <>
      <div className="bg-red-500 text-white p-4">
        If this is red, Tailwind is working!
      </div>
      <header className="bg-black-800 text-white p-4">
        <h1 className="text-2xl font-bold">Time Travel Playground</h1>
      </header>
      <main className="p-4">
        <EditorSection code={code} onChange={handleEditorChange} />
        <section className="mt-4">
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
            inputRef={inputRef}
          />
        </section>
        <section className="mt-4">
          <SliderSection
            historyLength={history.length}
            currentIndex={currentIndex}
            onChange={handleSliderChange}
          />
        </section>
      </main>
      <TestComponent />
      {isDiffViewerOpen && leftSnapshotIndex !== null && (
        <DiffViewer
          oldCode={history[leftSnapshotIndex].code}
          newCode={handleFreshCode()}
          onClose={() => setIsDiffViewerOpen(false)}
        />
      )}
    </>
  );
};

export default App;

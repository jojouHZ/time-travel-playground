import React, { useState, useEffect } from 'react';
import 'rc-slider/assets/index.css';
import { FaArrowLeft, FaArrowRight, FaCode } from 'react-icons/fa';
import {
  openDB,
  addSnapshot,
  getAllSnapshots,
  clearSnapshots,
  closeDB,
} from '../utils/indexedDB';
import { DiffViewer } from '../components/DiffViewer';
import ControlsSection from '../components/ControlsSection';
import { DarkModeToggle } from '../components/DarkMode';
import EditorSection from '../components/EditorSection';
import SliderSection from '../components/SliderSection';
import Button from '../components/Button';

const App = () => {
  const defaultMessage = '// Write your JavaScript code here...';
  const [code, setCode] = useState<string>(defaultMessage);
  const [currentCode, setCurrentCode] = useState<string>(defaultMessage);
  const [history, setHistory] = useState<
    Array<{ code: string; timestamp: string }>
  >([]);
  const [dbInitialized, setDbInitialized] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isDiffViewerOpen, setIsDiffViewerOpen] = useState<boolean>(false);
  const [leftSnapshotIndex, setLeftSnapshotIndex] = useState<number | null>(
    null
  );
  const [rightSnapshotIndex, setRightSnapshotIndex] = useState<number>(-1);

  useEffect(() => {
    const initDB = async () => {
      try {
        await openDB();
        const snapshots = await getAllSnapshots();
        setHistory(snapshots);
        if (snapshots.length > 0) {
          setCurrentIndex(snapshots.length);
          setCode(snapshots[snapshots.length - 1].code);
          setCurrentCode(snapshots[snapshots.length - 1].code);
        } else {
          setCurrentIndex(0);
          setCode(defaultMessage);
          setCurrentCode(defaultMessage);
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
    if (currentIndex === history.length) {
      setCode(currentCode);
    } else if (currentIndex >= 0 && history.length > 0) {
      setCode(history[currentIndex].code);
    }
  }, [currentIndex, history, currentCode]);

  const saveSnapshot = async () => {
    const snapshot = {
      code: currentCode,
      timestamp: new Date().toISOString(),
    };
    try {
      await addSnapshot(snapshot);
      const updatedSnapshots = await getAllSnapshots();
      setHistory(updatedSnapshots);
      setCurrentIndex(history.length);
    } catch (error) {
      console.error('Error saving snapshot:', error);
    }
  };

  const goBack = () => {
    console.log('goBack pressed');
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    console.log(currentIndex + ' ' + history.length);
  };

  const goForward = () => {
    console.log('goForward pressed');
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (currentIndex === history.length - 1) {
      setCurrentIndex(history.length);
      setCode(currentCode);
    }
    console.log(currentIndex + ' ' + history.length);
  };

  /** feature removed 
   * const loadSnapshot = (newIndex: number) => {
    if (newIndex === history.length) {
      setCurrentIndex(-1);
      setCode(currentCode);
    } else if (newIndex >= 0 && newIndex < history.length) {
      setCurrentIndex(newIndex);
      setCode(history[newIndex].code);
    }
  };
  **/

  const clearHistory = async () => {
    try {
      await clearSnapshots();
      const updatedSnapshots = await getAllSnapshots();
      setHistory(updatedSnapshots);
      setCurrentIndex(history.length);
      setCode('');
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const handleEditorChange = (newValue: string = '') => {
    setCode(newValue);
    setCurrentCode(newValue);
    setCurrentIndex(history.length);
  };

  const handleSliderChange = (newIndex: number | number[]) => {
    if (typeof newIndex === 'number') {
      if (newIndex === history.length) {
        setCurrentIndex(history.length);
        setCode(currentCode);
      } else {
        setCurrentIndex(newIndex);
      }
    }
  };

  const handlePrevious = () => {
    if (leftSnapshotIndex && leftSnapshotIndex > 0) {
      setLeftSnapshotIndex(leftSnapshotIndex - 1);
    }
  };

  const handleNext = () => {
    if (leftSnapshotIndex !== null && leftSnapshotIndex < history.length - 1) {
      setLeftSnapshotIndex(leftSnapshotIndex + 1);
    }
  };

  const openDiffViewer = () => {
    if (history.length > 0) {
      setLeftSnapshotIndex(history.length - 1);
    }
    setRightSnapshotIndex(history.length);
    setIsDiffViewerOpen(true);
  };

  return (
    <main className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white">
      <nav className="flex justify-end">
        <div className="absolute z-10 p-4">
          <DarkModeToggle />
        </div>
      </nav>
      <header className="flex p-8 justify-center">
        <h1 className="text-3xl font-bold font-[DejaVu Sans Mono]">
          Time Travel Playground
        </h1>
      </header>
      <section className="p-4" aria-labelledby="application-content">
        <h2 id="application-content" className="sr-only">
          Application Controls and Editor
        </h2>
        <section
          className="mt-4 flex space-x-8 justify-center"
          aria-labelledby="controls-heading"
        >
          <ControlsSection
            onSaveSnapshot={saveSnapshot}
            onClearHistory={clearHistory}
            dbInitialized={dbInitialized}
            historyLength={history.length}
          />
          <Button onClick={openDiffViewer} disabled={history.length < 1}>
            <FaCode className="w-3 h-3" /> Diff Viewer
          </Button>
        </section>
        <section className="mt-4" aria-labelledby="editor-heading">
          <EditorSection
            code={code}
            onChange={handleEditorChange}
            onSave={saveSnapshot}
          />
        </section>
        <section
          className="mt-4 pb-8 flex flex-col items-center"
          aria-labelledby="timeline-heading"
        >
          <h3 id="timeline-heading" className="sr-only">
            History Timeline
          </h3>
          <SliderSection
            historyLength={history.length}
            value={currentIndex}
            onChange={handleSliderChange}
          />
          <nav className="py-10 flex space-x-4 justify-center">
            <Button
              onClick={goBack}
              disabled={currentIndex === 0}
              className="w-32 inline-flex items-center justify-center"
            >
              <FaArrowLeft aria-hidden="true" />
              <span>Previous</span>
            </Button>

            <Button
              onClick={goForward}
              disabled={currentIndex >= history.length}
              className="w-32 inline-flex items-center justify-center"
            >
              <span>Next</span>
              <FaArrowRight aria-hidden="true" />
            </Button>
          </nav>
        </section>
      </section>
      {isDiffViewerOpen && leftSnapshotIndex !== null && (
        <dialog open className="fixed inset-0 z-50">
          <DiffViewer
            oldCode={history[leftSnapshotIndex].code}
            newCode={
              rightSnapshotIndex === history.length
                ? currentCode
                : history[rightSnapshotIndex].code
            }
            onPrevious={handlePrevious}
            onNext={handleNext}
            onClose={() => setIsDiffViewerOpen(false)}
            disabledPrevious={leftSnapshotIndex === 0}
            disabledNext={leftSnapshotIndex === history.length - 1}
          />
        </dialog>
      )}
    </main>
  );
};

export default App;

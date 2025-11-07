import React, { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FaSave, FaStepBackward, FaStepForward, FaCode, FaTimes, FaHistory } from 'react-icons/fa';
import dbHelper from './utils/indexedDB';
import './App.css';
import { DiffViewer } from './components/DiffViewer';

const App = () => {
  const defaultMessage = "// Write your JavaScript code here...";
  const [code, setCode] = useState<string>(defaultMessage);
  const [currentCode, setCurrentCode] = useState<string>(defaultMessage);
  const [history, setHistory] = useState<Array<{ code: string; timestamp: string }>>([]);
  const [dbInitialized, setDbInitialized] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isDiffViewerOpen, setIsDiffViewerOpen] = useState<boolean>(false);
  const [leftSnapshotIndex, setLeftSnapshotIndex] = useState<number | null>(null);
  const [rightSnapshotIndex, setRightSnapshotIndex] = useState<number>(-1);

  // this needs to be extracted into a custom hook, something like "useInitDB()"
  useEffect(() => {
    const initDB = async () => {
      try {
        await dbHelper.openDB();
        const snapshots = await dbHelper.getAllSnapshots();
        setHistory(snapshots);
        if (snapshots.length > 0) {
          setCurrentIndex(-1);
          setCode(snapshots[snapshots.length - 1].code);
          setCurrentCode(snapshots[snapshots.length - 1].code);
        }
        setDbInitialized(true);
      } catch (error) {
        console.error("Error initializing IndexedDB:", error);
      }
    };
    initDB();
    return () => {
      dbHelper.closeDB();
    };
  }, []);

  // next step for a future project would be to investigate what you might want to use, like redux + redux toolkin, or zustand, or some other flavour of state manager
  useEffect(() => {
    if (currentIndex === -1) {
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
      await dbHelper.addSnapshot(snapshot);
      const updatedSnapshots = await dbHelper.getAllSnapshots();
      setHistory(updatedSnapshots);
      setCurrentIndex(-1);
    } catch (error) {
      console.error("Error saving snapshot:", error);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (currentIndex === -1) {
      setCurrentIndex(history.length - 1);
    }
  };

  const goForward = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (currentIndex === history.length - 1) {
      setCurrentIndex(-1);
      setCode(currentCode);
    }
  };

  const loadSnapshot = (newIndex: number) => {
    if (newIndex === history.length) {
      setCurrentIndex(-1);
      setCode(currentCode);
    } else if (newIndex >= 0 && newIndex < history.length) {
      setCurrentIndex(newIndex);
      setCode(history[newIndex].code);
    }
  };

    const clearHistory = async () => {
    try {
      await dbHelper.clearSnapshots();
      const updatedSnapshots = await dbHelper.getAllSnapshots();
      setHistory(updatedSnapshots);
      setCurrentIndex(-1);
      setCode("");
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const handleEditorChange = (newValue: string = "") => {
    setCode(newValue);
    setCurrentCode(newValue);
  };

  return (
      // please do not use divs so sparingly, use HTML5 semantic components, like <section>, etc
    <div className="app-container">
      <h1 className="app-title">Time Travel Playground</h1>
      {/*this must be a separate component*/}
      <div className="editor-container">
        <Editor
          height="50vh"
          language="javascript"
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            wrappingIndent: "indent",
          }}
          theme="vs-dark"
          loading={<div>Loading Editor...</div>}
        />
      </div>
      <div className="controls-container">
        {/* make reusable button components here */}
        <button className="control-button" onClick={clearHistory} disabled={!dbInitialized}>
          <FaTimes /> Clear History
        </button>
        <button className="control-button" onClick={saveSnapshot} disabled={!dbInitialized}>
          <FaSave /> Save Snapshot
        </button>
        <button className="control-button" onClick={goBack} disabled={currentIndex === 0}>
          <FaStepBackward /> Back
        </button>
        <button className="control-button" onClick={goForward} disabled={currentIndex >= history.length || currentIndex === -1}>
          <FaStepForward /> Forward
        </button>
        {/* must be a separate component*/}
        <div className="snapshot-input-container">
          <input
            id="input-value"
            type="number"
            placeholder="0+"
            min="0"
            className="snapshot-input"
          />
          <button
            className="control-button"
            onClick={() => {
              const inputValue = parseInt((document.getElementById("input-value") as HTMLInputElement).value);
              loadSnapshot(inputValue);
            }}
          >
            Load Snapshot
          </button>
        </div>
        <button
          className="control-button"
          onClick={() => {
            setIsDiffViewerOpen(true);
            if (history.length > 0) {
              setLeftSnapshotIndex(history.length - 1);
            }
            setRightSnapshotIndex(-1);
          }}
          disabled={history.length < 1}
        >
          <FaCode /> Diff Viewer
        </button>
      </div>
      {isDiffViewerOpen && leftSnapshotIndex !== null && (
        <DiffViewer
          oldCode={history[leftSnapshotIndex].code}
          newCode={rightSnapshotIndex === -1 ? currentCode : history[rightSnapshotIndex].code}
          onClose={() => setIsDiffViewerOpen(false)}
        />
      )}
      <div className="history-slider-container">
        <Slider
          min={0}
          max={history.length}
          value={currentIndex === -1 ? history.length : currentIndex}
          // this needs to be handled in its own method
          onChange={(newIndex: number | number[]) => {
            if (typeof newIndex === 'number') {
              if (newIndex === history.length) {
                setCurrentIndex(-1);
                setCode(currentCode);
              } else {
                setCurrentIndex(newIndex);
              }
            }
          }}
          // this is really hard to read
          marks={{
            0: 'Start',
            ...history.reduce((acc, item, index) => {
              if (index > 0 && index < history.length) {
                acc[index] = (index).toString();
              }
              return acc;
            }, {} as Record<number, string>),
            [history.length]: 'Current'
          }}
          step={null}
        />
      </div>
      <div className="bottom-nav">
        <button className="contact-button">Contacts</button>
        <button className="project-button">Start Projects</button>
      </div>
    </div>
  );
};

export default App;

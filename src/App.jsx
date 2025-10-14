import { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import dbHelper from './utils/indexedDB';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const App = () => {
  const defaultMessage = "// Write your JavaScript code here...";
  const [code, setCode] = useState(defaultMessage);
  const [currentCode, setCurrentCode] = useState(defaultMessage);
  const [history, setHistory] = useState([]);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isDiffViewerOpen, setIsDiffViewerOpen] = useState(false);
  const [selectedSnapshotIndex, setSelectedSnapshotIndex] = useState(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        await dbHelper.openDB();
        const snapshots = await dbHelper.getAllSnapshots();
        setHistory(snapshots);
        if (snapshots.length > 0) {
          setCurrentIndex(-1); // Start in "Current" state
          setCurrentIndex(snapshots.length - 1); // Load the latest snapshot
          setCode(snapshots[snapshots.length - 1].code);
          setCurrentCode(snapshots[snapshots.length - 1].code); // Set "Current" code
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

  useEffect(() => {
    if (currentIndex === -1) {
      // "Current" state: Do not load from history
    } else if (currentIndex >= 0 && history.length > 0) {
      setCode(history[currentIndex].code);
    }
  }, [currentIndex, history]);

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
      setCurrentIndex(-1); // Go to the "Current" code
      setCode(currentCode); // Load the "Current" code
    }
  };

  const saveSnapshot = async () => {
    const snapshot = {
      code,
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

  const loadSnapshot = (newIndex) => {
    if (newIndex === history.length) {
      setCurrentIndex(-1); // "Current" state
      setCode(currentCode); // Load the "Current" code
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

  const handleEditorChange = (newValue = "") => {
    setCode(newValue);
    setCurrentCode(newValue);
  };

  return (
    <div>
      <h1>Time Travel Playground</h1>
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
      <button onClick={clearHistory} disabled={!dbInitialized}>Clear History</button>
      <button onClick={saveSnapshot} disabled={!dbInitialized}>Save Snapshot</button>
      <button onClick={goBack} disabled={currentIndex === 0}>Back</button>
      <button onClick={goForward} disabled={currentIndex >= history.length || currentIndex === -1}>Forward</button>
      <span>
        <input
          id="input-value"
          type="number"
          placeholder="0+"
          min="0"
        />
        <button
          onClick={() => {
            const inputValue = parseInt(document.getElementById("input-value").value);
            loadSnapshot(inputValue);
          }}
        >
          Load Snapshot
        </button>
      </span>
      <button
        onClick={() => setIsDiffViewerOpen(true)}
        disabled={history.length < 2}
      >
        Diff Viewer
      </button>

      {isDiffViewerOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            textAlign: 'center',
            width: '80%',
            maxWidth: '800px',
          }}>
            <h2>Diff Viewer</h2>
            <div style={{ margin: '20px 0' }}>
              <p>Compare "Current" code with:</p>
              <select
                value={selectedSnapshotIndex || ""}
                onChange={(e) => setSelectedSnapshotIndex(parseInt(e.target.value))}
                style={{ padding: '8px', width: '100%' }}
              >
                <option value="">Select Snapshot</option>
                {history.map((_, index) => (
                  <option key={index} value={index}>
                    Snapshot {index + 1}
                  </option>
                ))}
              </select>
            </div>
             {selectedSnapshotIndex !== null && (
              <div style={{ margin: '20px 0', textAlign: 'left' }}>
                <h3>Current Code:</h3>
                <pre style={{
                  backgroundColor: '#f5f5f5',
                  padding: '10px',
                  borderRadius: '5px',
                  maxHeight: '300px',
                  overflow: 'auto'
                }}>
                  {currentCode}
                </pre>
                <h3>Snapshot {selectedSnapshotIndex + 1}:</h3>
                <pre style={{
                  backgroundColor: '#f5f5f5',
                  padding: '10px',
                  borderRadius: '5px',
                  maxHeight: '300px',
                  overflow: 'auto'
                }}>
                  {history[selectedSnapshotIndex].code}
                </pre>
              </div>
            )}

            <button
              onClick={() => setIsDiffViewerOpen(false)}
              style={{ marginTop: '20px', padding: '10px 20px' }}
            >Close</button>
          </div>
        </div>
      )}


      <div style={{ width: '500px', margin: '20px' }}>
        <Slider
          min={0}
          max={history.length}
          value={currentIndex === -1 ? history.length : currentIndex}
          onChange={(newIndex) => {
            if (newIndex === history.length) {
              setCurrentIndex(-1); // "Current" state
              setCode(currentCode);
            } else {
              setCurrentIndex(newIndex);
            }
          }}
          marks={{
            ...history.reduce((acc, _, index) => {
              acc[index] = `Snapshot ${index + 1}`;
              return acc;
            }, {}),
            [history.length]: "Current",
          }}
          step={null}
        />
      </div>
      <div>
        <h2>History</h2>
        <pre>{JSON.stringify(history, null, 2)}</pre>
      </div>
    </div>
  );
};

export default App;

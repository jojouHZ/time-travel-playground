import { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import dbHelper from './utils/indexedDB';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const App = () => {
  const defaultMessage = "// Write your JavaScript code here...";
  const [code, setCode] = useState(defaultMessage);
  const [history, setHistory] = useState([]);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isEditorTouched, setIsEditorTouched] = useState(false);

  useEffect(() => {
    const initDB = async () => {
      try {
        await dbHelper.openDB();
        const snapshots = await dbHelper.getAllSnapshots();
        setHistory(snapshots);
        setDbInitialized(true);
        if (snapshots.length > 0) {
          setCurrentIndex(snapshots.length - 1);
          setCode(snapshots[snapshots.length - 1].code);
        }
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
    if (currentIndex >= 0 && history.length > 0) {
      setCode(history[currentIndex].code);
    }
  }, [currentIndex, history]);


  const saveSnapshot = async () => {
    const snapshot = {
      code,
      timestamp: new Date().toISOString(),
    };
    try {
      await dbHelper.addSnapshot(snapshot);
      const updatedSnapshots = await dbHelper.getAllSnapshots();
      setHistory(updatedSnapshots);
      setCurrentIndex(updatedSnapshots.length - 1);
      setCode(updatedSnapshots[updatedSnapshots.length - 1].code);
    } catch (error) {
      console.error("Error saving snapshot:", error);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goForward = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const loadSnapshot = (newIndex) => {
    if (newIndex >= 0 && newIndex < history.length) {
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
    if (!isEditorTouched && newValue !== defaultMessage) {
      setIsEditorTouched(true);
    }
    setCode(newValue);
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
      <button onClick={clearHistory}>Clear History</button>
      <button onClick={saveSnapshot}>Save Snapshot</button>
      <button onClick={goBack} disabled={currentIndex <= 0}>Back</button>
      <button onClick={goForward} disabled={currentIndex >= history.length - 1}>Forward</button>

      <span>
        <input
          id="input-value"
          type="number"
          placeholder="-1 or 0+"
          min="-1"
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

      <div style={{ width: '500px', margin: '20px' }}>
        <Slider
          min={0}
          max={history.length > 0 ? history.length - 1 : 0}
          value={currentIndex}
          onChange={(newIndex) => loadSnapshot(newIndex)}
          marks={{
            ...history.reduce((acc, _, index) => {
              acc[index] = `Snapshot ${index + 1}`;
              return acc;
            }, {}),
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

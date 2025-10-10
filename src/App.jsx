import { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import dbHelper from './utils/indexedDB';

const App = () => {
  const [code, setCode] = useState("// Write your JavaScript code here...");
  const [history, setHistory] = useState([]);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    const initDB = async () => {
      try {
        await dbHelper.openDB();
        const snapshots = await dbHelper.getAllSnapshots();
        setHistory(snapshots);
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

  const saveSnapshot = async () => {
    const snapshot = {
      code,
      timestamp: new Date().toISOString(),
    };
    try {
      await dbHelper.addSnapshot(snapshot);
      const updatedSnapshots = await dbHelper.getAllSnapshots();
      setHistory(updatedSnapshots);
    } catch (error) {
      console.error("Error saving snapshot:", error);
    }
  };

  const loadSnapshot = (index) => {
    if (index >= 0 && index < history.length) {
      setCode(history[index].code);
      setCurrentIndex(index);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      loadSnapshot(currentIndex - 1);
    } else if (currentIndex === 0) {
      // Return to the "current code" (not a snapshot)
      setCurrentIndex(-1);
    }
  };
  
  const goForward = () => {
    if (currentIndex < history.length - 1) {
      loadSnapshot(currentIndex + 1);
    }
  };

  const handleEditorChange = (newValue = "") => {
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
      <button onClick={saveSnapshot}>Save Snapshot</button>
      <button onClick={goBack} disabled={currentIndex < 0}>Back</button>
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
      
      <div>
        <h2>History</h2>
        <pre>{JSON.stringify(history, null, 2)}</pre>
      </div>
    </div>
  );
};

export default App;

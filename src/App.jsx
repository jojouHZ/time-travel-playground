
import { useState, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import dbHelper from './utils/indexedDB';


const App = () => {
  // default state; "code": Stores the current code in the editor.
  const [code, setCode] = useState("// Write your JavaScript code here..."); 
  // "history": Stores the list of code snapshots loaded from IndexedDB.
  const [history, setHistory] = useState([]);
  // "dbInitialized": Tracks whether the database is ready.
  const [dbInitialized, setDbInitialized] = useState(false);


  // Initialize IndexedDB and load snapshots
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

    // Cleanup: Close the database when the component unmounts
    return () => {
      dbHelper.closeDB();
    };
  }, []);

  /* 
    "-1" - live code, 
    "0" - last saved snapshot, 
    "1" - second to last saved snapshot, 
    ...  - etc.
  */
  const [currentIndex, setCurrentIndex] = useState(-1); 

  
  // Save a snapshot of the current code
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
  
  
  // Temporary
  const inputValue = document.getElementById("input-value");


  // Load a snapshot by its index
  const loadSnapshot = (index) => {
    if (index >= 0 && index < history.legth) {
      setCode(history[index].code);
      setCurrentIndex(index);
    }
  }

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
      <span>
        <input id="input-value" 
              type="text" 
              inputmode="numeric" 
              pattern="^(?:-1|0|[1-9]d*)$" 
              placeholder="-1 or 0+">
        </input>
        <button onClick={loadSnapshot(inputValue)}>Load Snapshot</button>

      </span>

      <div>
        <h2>History</h2>
        <pre>{JSON.stringify(history, null, 2)}</pre>
      </div>
    </div>
  );
};

export default App;
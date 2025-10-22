import { useState, useEffect, useRef } from 'react';
import Editor from "@monaco-editor/react";
import dbHelper from './utils/indexedDB';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { diffLines } from 'diff';

const TypingAnimation = ({ line, onAnimationComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < line.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(prev => prev + line[index]);
        setIndex(prev => prev + 1);
      }, 10); // Adjust the speed of typing here (milliseconds per character)

      return () => clearTimeout(timeoutId);
    } else {
      onAnimationComplete();
    }
  }, [index, line, onAnimationComplete]);

  return <span>{displayedText}</span>;
};

const App = () => {
  const defaultMessage = "// Write your JavaScript code here...";
  const [code, setCode] = useState(defaultMessage);
  const [currentCode, setCurrentCode] = useState(defaultMessage);
  const [history, setHistory] = useState([]);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isDiffViewerOpen, setIsDiffViewerOpen] = useState(false);
  const [leftSnapshotIndex, setLeftSnapshotIndex] = useState(null);
  const [rightSnapshotIndex, setRightSnapshotIndex] = useState(-1);
  const leftCodeRef = useRef(null);
  const rightCodeRef = useRef(null);
  const [animatedLines, setAnimatedLines] = useState({});

  useEffect(() => {
    setAnimatedLines({});
  }, [leftSnapshotIndex, rightSnapshotIndex]);

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

  const loadSnapshot = (newIndex) => {
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

  const handleEditorChange = (newValue = "") => {
    setCode(newValue);
    setCurrentCode(newValue);
  };

  const handleScroll = (e) => {
    const leftElement = leftCodeRef.current;
    const rightElement = rightCodeRef.current;
    if (e.target === leftElement) {
      rightElement.scrollTop = leftElement.scrollTop;
    } else if (e.target === rightElement) {
      leftElement.scrollTop = rightElement.scrollTop;
    }
  };

  const getLineDiffs = (oldCode, newCode) => {
    return diffLines(oldCode, newCode);
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
        onClick={() => {
          setIsDiffViewerOpen(true);
          if (history.length > 0) {
            setLeftSnapshotIndex(history.length - 1);
          }
          setRightSnapshotIndex(-1);
        }}
        disabled={history.length < 1}
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
          }}>
            <h2 style={{ textAlign: 'center', marginTop: '20px' }}>Diff Viewer</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
              <div style={{ width: '48%' }}>
                <h3 style={{ marginTop: '20px' }}>Snapshot {leftSnapshotIndex !== null ? leftSnapshotIndex + 1 : ""}</h3>
                <pre
                  ref={leftCodeRef}
                  onScroll={handleScroll}
                  style={{
                    textAlign: 'left',
                    backgroundColor: '#f5f5f5',
                    padding: '10px',
                    borderRadius: '5px',
                    maxHeight: '500px',
                    overflow: 'auto'
                  }}
                >
                  {leftSnapshotIndex !== null && history[leftSnapshotIndex]?.code
                    .split('\n')
                    .map((line, index) => {
                      const diffs = getLineDiffs(
                        history[leftSnapshotIndex].code,
                        rightSnapshotIndex === -1 ? currentCode : history[rightSnapshotIndex].code
                      );
                      const isRemoved = diffs.some(diff => diff.removed && diff.value.includes(line));
                      return (
                        <div
                          key={index}
                          style={{
                            color: isRemoved ? '#ff4444' : 'inherit',
                            textDecoration: isRemoved ? 'line-through' : 'none',
                          }}
                        >
                          {line}
                        </div>
                      );
                    })}
                </pre>
                <p>Select code version:</p>
                <select
                  value={leftSnapshotIndex || ""}
                  onChange={(e) => setLeftSnapshotIndex(parseInt(e.target.value))}
                  style={{ padding: '8px', width: '40%', justifyContent: 'left' }}
                >
                  <option value="">Select Snapshot</option>
                  {history.map((_, index) => (
                    <option key={index} value={index}>
                      Snapshot {index + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ width: '48%' }}>
                <h3 style={{ marginTop: '20px' }}>Current Code</h3>
                <pre
                  ref={rightCodeRef}
                  onScroll={handleScroll}
                  style={{
                    textAlign: 'left',
                    backgroundColor: '#f5f5f5',
                    padding: '10px',
                    borderRadius: '5px',
                    maxHeight: '500px',
                    overflow: 'auto'
                  }}
                >
                  {(rightSnapshotIndex === -1 ? currentCode : history[rightSnapshotIndex]?.code)
                    .split('\n')
                    .map((line, index) => {
                      const diffs = getLineDiffs(
                        history[leftSnapshotIndex]?.code,
                        rightSnapshotIndex === -1 ? currentCode : history[rightSnapshotIndex]?.code
                      );
                      const isAdded = diffs.some(diff => diff.added && diff.value.includes(line));
                      const lineKey = `${index}-${line}`; // Unique key for each line

                      return (
                        <div
                          key={lineKey}
                          style={{
                            color: isAdded ? '#00C851' : 'inherit',
                          }}
                        >
                          {isAdded && !animatedLines[lineKey] ? (
                            <TypingAnimation
                              line={line}
                              onAnimationComplete={() => setAnimatedLines(prev => ({ ...prev, [lineKey]: true }))}
                            />
                          ) : line}
                        </div>
                      );
                    })}
                </pre>
                <p>Select code version:</p>
                <select
                  value={rightSnapshotIndex}
                  onChange={(e) => setRightSnapshotIndex(parseInt(e.target.value))}
                  style={{ padding: '8px', width: '40%', justifyContent: 'left' }}
                >
                  <option value="-1">Current Code</option>
                  {history.map((_, index) => (
                    <option key={index} value={index}>
                      Snapshot {index + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => setIsDiffViewerOpen(false)}
              style={{ marginTop: '20px', padding: '10px 20px' }}
            >
              Close
            </button>
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
              setCurrentIndex(-1);
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

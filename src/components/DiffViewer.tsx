import React, { useState, useRef, useEffect } from 'react';
import { Diff, parseDiff } from 'react-diff-view';
import 'react-diff-view/style/index.css';
import { FaTimes, FaCode, FaExchangeAlt, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import styles from './DiffViewer.module.css';

interface DiffViewerProps {
  oldCode: string;
  newCode: string;
  onClose: () => void;
}

interface Change {
  lineNumber: number;
  oldLine: string;
  newLine: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ oldCode, newCode, onClose }) => {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [currentChangeIndex, setCurrentChangeIndex] = useState<number>(0);
  const diffContainerRef = useRef<HTMLDivElement>(null);

const generateDiffText = () => {
  const diffText = [
    '--- a/old-file',
    '+++ b/new-file',
    '@@ -1,' + oldCode.split('\n').length + ' +1,' + newCode.split('\n').length + ' @@'
  ];

  const oldLines = oldCode.split('\n');
  const newLines = newCode.split('\n');
  const changes: Change[] = [];
  let inChangeBlock = false;
  let changeStartLine = 0;

  // this is very hard to read stacked like this, needs to be separated into its own sub-methods
  for (let i = 0; i < Math.max(oldLines.length, newLines.length); i++) {
    if (i < oldLines.length && i < newLines.length) {
      if (oldLines[i] !== newLines[i]) {
        if (!inChangeBlock) {
          inChangeBlock = true;
          changeStartLine = i + 1;
        }
        diffText.push(`-${oldLines[i]}`);
        diffText.push(`+${newLines[i]}`);
      } else {
        if (inChangeBlock) {
          changes.push({ 
            lineNumber: changeStartLine, 
            oldLine: oldLines.slice(changeStartLine - 1, i).join('\n'), 
            newLine: newLines.slice(changeStartLine - 1, i).join('\n') 
          });
          inChangeBlock = false;
        }
        diffText.push(` ${oldLines[i]}`);
      }
    } else if (i < oldLines.length) {
      if (!inChangeBlock) {
        inChangeBlock = true;
        changeStartLine = i + 1;
      }
      diffText.push(`-${oldLines[i]}`);
    } else if (i < newLines.length) {
      if (!inChangeBlock) {
        inChangeBlock = true;
        changeStartLine = i + 1;
      }
      diffText.push(`+${newLines[i]}`);
    }
  }

  if (inChangeBlock) {
    const endLine = Math.max(oldLines.length, newLines.length);
    changes.push({ 
      lineNumber: changeStartLine, 
      oldLine: oldLines.slice(changeStartLine - 1, endLine).join('\n'), 
      newLine: newLines.slice(changeStartLine - 1, endLine).join('\n') 
    });
  }

  changes.sort((a, b) => a.lineNumber - b.lineNumber);

  return { diffText: diffText.join('\n'), changes };
};

  const { diffText, changes } = generateDiffText();
  const diffs = parseDiff(diffText, { nearbySequences: 'zip' });

  const scrollToLine = () => {
    if (changes.length === 0 || !diffContainerRef.current) {
      return;
    }

    setTimeout(() => {
      const currentChange = changes[currentChangeIndex];

      if (!currentChange) {
        return;
      }

      const lineNumber = currentChange.lineNumber;
      const lineHeight = 24;
      const scrollPosition = (lineNumber - 1) * lineHeight;

      if (diffContainerRef.current) {
        diffContainerRef.current.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const navigateChange = (direction: 'prev' | 'next') => {

    if (direction === 'prev') {
      setCurrentChangeIndex(prevIndex => Math.max(prevIndex - 1, 0));
    } else {
      setCurrentChangeIndex(prevIndex => Math.min(prevIndex + 1, changes.length - 1));
    }
  };

  const handlePreviousClick = () => {
    navigateChange('prev');
  };

  const handleNextClick = () => {
    navigateChange('next');
  };

  useEffect(() => {
    scrollToLine();
  }, [currentChangeIndex]);

  return (
      // too many divs again, refrain from using them
    <div className={styles.container}>
      <div className={styles.modal}>
        <div className={styles.headerContainer}>
          <h2 className={styles.header}>
            <FaCode /> Diff Viewer
          </h2>
          {/* needs to be a separate component*/}
          <div className={styles.viewButtons}>
            <button className={styles.viewButton} onClick={() => setViewMode('split')}>
              <FaExchangeAlt /> Split View
            </button>
            <button className={styles.viewButton} onClick={() => setViewMode('unified')}>
              Unified View
            </button>
            <button className={`${styles.viewButton} ${styles.closeButton}`} onClick={onClose}>
              <FaTimes /> Close
            </button>
          </div>
        </div>
        <div className={styles.codeContainer} ref={diffContainerRef}>
          {diffs.map((diff, index) => (
            <Diff
              key={index}
              viewType={viewMode}
              diffType="modify"
              hunks={diff.hunks}
            />
          ))}
        </div>
        {/* needs to be in a separate component */}
        <div className={styles.navigationContainer}>
          <div className={styles.changeCounter}>
            Change {currentChangeIndex + 1} of {changes.length}
          </div>
          <div className={styles.navigationButtons}>
            <button
              className={styles.navButton}
              onClick={handlePreviousClick}
              disabled={currentChangeIndex <= 0}
            >
              <FaArrowLeft /> Previous
            </button>
            <button
              className={styles.navButton}
              onClick={handleNextClick}
              disabled={currentChangeIndex >= changes.length - 1}
            >
              Next <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

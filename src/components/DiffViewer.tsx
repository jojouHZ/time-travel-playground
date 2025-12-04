import React, { useState, useRef, useEffect } from 'react';
import { Diff, parseDiff, Hunk } from 'react-diff-view';
import 'react-diff-view/style/index.css';
import {
  FaTimes,
  FaCode,
  FaExchangeAlt,
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa';
import Button from './Button';
import type { Token as PrismToken } from 'prism-react-renderer';

interface DiffViewerProps {
  oldCode: string;
  newCode: string;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  disabledPrevious: boolean;
  disabledNext: boolean;
}

interface Change {
  lineNumber: number;
  oldLine: string;
  newLine: string;
}

const themeColors: Record<string, string> = {
  keyword: '#c792ea',
  string: '#c3e88d',
  comment: '#546e7a',
  number: '#f78c6c',
  function: '#82aaff',
  plain: '#ffffff',
};

export const DiffViewer: React.FC<DiffViewerProps> = ({
  oldCode,
  newCode,
  onPrevious,
  onNext,
  onClose,
  disabledPrevious,
  disabledNext,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [currentChangeIndex, setCurrentChangeIndex] = useState<number>(0);
  const diffContainerRef = useRef<HTMLDivElement>(null);

  const generateDiffText = () => {
    const diffText = [
      '--- a/old-file',
      '+++ b/new-file',
      '@@ -1,' +
        oldCode.split('\n').length +
        ' +1,' +
        newCode.split('\n').length +
        ' @@',
    ];

    const oldLines = oldCode.split('\n');
    const newLines = newCode.split('\n');
    const changes: Change[] = [];
    let inChangeBlock = false;
    let changeStartLine = 0;

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
              newLine: newLines.slice(changeStartLine - 1, i).join('\n'),
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
        newLine: newLines.slice(changeStartLine - 1, endLine).join('\n'),
      });
    }

    changes.sort((a, b) => a.lineNumber - b.lineNumber);

    return { diffText: diffText.join('\n'), changes };
  };

  const { diffText, changes } = generateDiffText();
  const diffs = parseDiff(diffText, { nearbySequences: 'zip' });

  const handlePreviousClick = () => {
    onPrevious();
  };

  const handleNextClick = () => {
    onNext();
  };

  const renderToken = (token: any): React.ReactNode => {
    const type = token.types & token.types[0] ? token.types[0] : 'plain';
    const color = themeColors[type] || themeColors.plain;
    return <span style={{ color }}>{token.content}</span>;
  };

  return (
    <main className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center">
      <article className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white p-5 rounded-lg shadow-lg w-11/12 h-4/5 max-w-8xl flex flex-col">
        <header className="flex justify-between items-center py-5">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2.5 flex-1">
            <FaCode /> Diff Viewer
          </h2>
        </header>
        <nav className="flex justify-end gap-2.5 pb-4">
          <span>
            <Button
              onClick={() =>
                setViewMode(viewMode === 'split' ? 'unified' : 'split')
              }
            >
              <FaExchangeAlt /> {viewMode === 'split' ? 'Unified' : 'Split'}
            </Button>
          </span>
          <span>
            <Button onClick={onClose}>
              <FaTimes /> Close
            </Button>
          </span>
        </nav>

        <section
          className="flex-1 overflow-hidden border border-gray-300 rounded-lg"
          ref={diffContainerRef}
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="h-full overflow-auto p-2.5 diff-viewer-container bg-gray-200 dark:bg-gray-200 dark:text-gray-800">
            {diffs.map((diff, index) => (
              <Diff
                key={index}
                viewType={viewMode}
                diffType={diff.type || 'modify'}
                hunks={diff.hunks}
                renderToken={renderToken}
              >
                {(hunks) =>
                  hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)
                }
              </Diff>
            ))}
          </div>
        </section>

        <footer className="flex justify-between items-center mt-2.5">
          <output className="ml-2.5 text-sm text-gray-700">
            {changes.length === 0
              ? 'no changes'
              : `
            Change ${currentChangeIndex + 1} of ${changes.length}`}
          </output>
          <nav className="flex gap-2.5">
            <Button onClick={handlePreviousClick} disabled={disabledPrevious}>
              {' '}
              <FaArrowLeft /> Previous
            </Button>
            <Button onClick={handleNextClick} disabled={disabledNext}>
              {' '}
              Next <FaArrowRight />
            </Button>
          </nav>
        </footer>
      </article>
    </main>
  );
};

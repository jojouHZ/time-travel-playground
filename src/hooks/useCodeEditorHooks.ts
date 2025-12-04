import { useRef, useEffect } from 'react';

export const useSnapshotNavigation = (
  currentIndex: number,
  history: Array<{ code: string }>,
  currentCode: string,
  setCode: (code: string) => void
) => {
  useEffect(() => {
    if (currentIndex === -1) {
      setCode(currentCode);
    } else if (currentIndex >= 0 && history.length > 0) {
      setCode(history[currentIndex].code);
    }
  }, [currentIndex, history, currentCode]);
};

export const useSnapshotHandlers = (
  loadSnapshot: (index: number) => void,
  history: Array<{ code: string }>,
  setIsDiffViewerOpen: (isOpen: boolean) => void,
  setLeftSnapshotIndex: (index: number | null) => void,
  setRightSnapshotIndex: (index: number) => void
) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLoadSnapshot = () => {
    const inputValue = inputRef.current
      ? parseInt(inputRef.current.value || '0')
      : 0;
    loadSnapshot(inputValue);
  };

  const handleOpenDiffViewer = () => {
    setIsDiffViewerOpen(true);
    if (history.length > 0) {
      setLeftSnapshotIndex(history.length - 1);
    }
    setRightSnapshotIndex(-1);
  };

  return { inputRef, handleLoadSnapshot, handleOpenDiffViewer };
};

import { openDB, getAllSnapshots, closeDB } from './indexedDB';
import { Snapshot } from '../types';

export const initializeDBAndFetchSnapshots = async (
  addSnapshot: (snapshot: Snapshot) => void,
  setCurrentCode: (code: string) => void,
  setCode: (code: string) => void,
  setDbInitialized: (initialized: boolean) => void
) => {
  try {
    await openDB();
    const snapshots = await getAllSnapshots();
    snapshots.forEach((snapshot: Snapshot) => addSnapshot(snapshot));
    if (snapshots.length > 0) {
      setCurrentCode(snapshots[snapshots.length - 1].code);
      setCode(snapshots[snapshots.length - 1].code);
    }
    setDbInitialized(true);
  } catch (error) {
    console.error('Error initializing IndexedDB:', error);
  }
};

export const closeDatabase = () => {
  closeDB();
};

import React from 'react';
import { FaSave, FaCode, FaTimes } from 'react-icons/fa';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface ControlsSectionProps {
  onClearHistory: () => void;
  onSaveSnapshot: () => void;
  dbInitialized: boolean;
  historyLength: number;
}

const ControlsSection: React.FC<ControlsSectionProps> = ({
  onClearHistory,
  onSaveSnapshot,
  dbInitialized,
  historyLength,
}) => {
  return (
    <>
      <menu className="flex justify-center items-center">
        <h2 id="application-content" className="sr-only">
          Save Snapshot & Clear indexedDB storage
        </h2>
        <div className="inline-flex" role="group">
          <Menu
            as="div"
            className=" relative inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <div
              className="inline-flex divide-x divide-gray-300 rounded border 
                            dark:divide-white/25 border-gray-300 dark:border-white/25 shadow-md 
                          dark:shadow-none dark:text-white text-sm text-gray-900"
            >
              <button
                onClick={onSaveSnapshot}
                disabled={!dbInitialized}
                className="inline-flex justify-center items-center gap-x-1.5 rounded-l 
                            pl-3 pr-6 py-2 bg-white hover:bg-gray-50 dark:bg-white/10 
                             dark:hover:bg-white/20 "
              >
                <FaSave /> Save Code
              </button>
              <MenuButton
                className="inline-flex justify-center items-center gap-x-1.5 rounded-r  
                            px-3 py-2 bg-white hover:bg-gray-50 dark:bg-white/10 
                             dark:hover:bg-white/20 "
              >
                <ChevronDownIcon
                  aria-hidden="true"
                  className="-mx-2 size-4 text-gray-400 dark:text-white"
                />
              </MenuButton>
            </div>
            <MenuItems
              transition
              className="absolute z-10 right-0 mt-2 origin-top-right text-sm w-full"
            >
              <MenuItem>
                <button
                  onClick={onClearHistory}
                  disabled={historyLength === 0}
                  className="inline-flex px-3 py-2 items-center right gap-x-1.5 w-full
                              bg-white hover:bg-gray-50 dark:bg-white/10 
                              dark:hover:bg-white/20"
                >
                  <FaTimes className="w-3 h-3 fill-red-700" /> Clear History
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </menu>
    </>
  );
};

export default ControlsSection;

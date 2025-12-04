import { useState } from 'react';

export const useEditor = (defaultMessage: string) => {
  const [code, setCode] = useState<string>(defaultMessage);
  const [currentCode, setCurrentCode] = useState<string>(defaultMessage);

  const handleEditorChange = (newValue: string = '') => {
    setCode(newValue);
    setCurrentCode(newValue);
  };

  return { code, setCode, currentCode, setCurrentCode, handleEditorChange };
};

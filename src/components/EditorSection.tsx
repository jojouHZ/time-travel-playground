import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

interface EditorSectionProps {
  code: string;
  onChange: (value: string | undefined) => void;
  onSave: (value: string) => void;
}

const EditorSection: React.FC<EditorSectionProps> = ({
  code,
  onChange,
  onSave,
}) => {
  const editorRef = useRef<any>(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (editorRef.current) {
        const currentCode = editorRef.current.getValue();
        onSave(currentCode);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSave]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <section>
      <Editor
        height="60vh"
        language="javascript"
        value={code}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          wrappingIndent: 'indent',
          padding: { top: 50, bottom: 50 },
        }}
        theme="vs-dark"
        loading={<div>Loading Editor...</div>}
      />
    </section>
  );
};

export default EditorSection;

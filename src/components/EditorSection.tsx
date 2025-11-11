import React from 'react';
import Editor from '@monaco-editor/react';

interface EditorSectionProps {
  code: string;
  onChange: (value: string | undefined) => void;
}

const EditorSection: React.FC<EditorSectionProps> = ({ code, onChange }) => {
  return (
    <section className="editor-container">
      <Editor
        height="50vh"
        language="javascript"
        value={code}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          wrappingIndent: 'indent',
        }}
        theme="vs-dark"
        loading={<div>Loading Editor...</div>}
      />
    </section>
  );
};

export default EditorSection;

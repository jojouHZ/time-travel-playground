import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface HighlightedTokenProps {
  text: string;
  language?: string;
}

const HighlightedToken: React.FC<HighlightedTokenProps> = ({
  text,
  language = 'javascript',
}) => {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      PreTag="span"
      wrapLines={false}
      showLineNumbers={false}
      customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
    >
      {text}
    </SyntaxHighlighter>
  );
};

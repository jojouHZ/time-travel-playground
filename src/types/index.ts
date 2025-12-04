export interface Snapshot {
  code: string;
  timestamp: string;
}

export interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

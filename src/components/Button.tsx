import React from 'react';
import { ButtonProps } from '../types';

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      className={
        (className = `inline-flex justify-center items-center rounded-l border
                            pl-6 pr-6 py-2 bg-white hover:bg-gray-50 dark:bg-white/10 
                             dark:hover:bg-white/20  border-gray-300 dark:border-white/25 shadow-md 
                          dark:shadow-none gap-2  ${className}`)
      }
      onClick={onClick}
      disabled={disabled}
    >
      {children}{' '}
    </button>
  );
};
export default Button;

import React from 'react';

interface SortUpIconProps {
  className?: string;
}

export const SortUpIcon: React.FC<SortUpIconProps> = ({ className = "w-4 h-4 text-indigo-400" }) => (
  <svg 
    className={className} 
    fill="currentColor" 
    viewBox="0 0 20 20" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    data-testid="sort-up-icon"
  >
    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);
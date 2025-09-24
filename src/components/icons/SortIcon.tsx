import React from 'react';

interface SortIconProps {
  className?: string;
}

export const SortIcon: React.FC<SortIconProps> = ({ className = "w-4 h-4 text-gray-500" }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="img"
    data-testid="sort-icon"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
  </svg>
);
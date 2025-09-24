import React from 'react';

interface PaginationProps {
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
  };
}

export const Pagination: React.FC<PaginationProps> = ({ pagination }) => {
  const { currentPage, pageSize, totalItems, totalPages, setCurrentPage, setPageSize } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) {
        pageNumbers.push('...');
      }
      if (currentPage > 2) {
        pageNumbers.push(currentPage - 1);
      }
      if (currentPage !== 1 && currentPage !== totalPages) {
        pageNumbers.push(currentPage);
      }
      if (currentPage < totalPages - 1) {
        pageNumbers.push(currentPage + 1);
      }
      if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }
    return [...new Set(pageNumbers)];
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-2 py-3 text-sm text-gray-400">
      <div className="flex items-center space-x-2 mb-2 sm:mb-0">
        <span className="mr-2">Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="bg-gray-700 border border-gray-600 rounded-md py-1 pl-2 pr-7 text-gray-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        >
          {[5, 10, 20, 50].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <span className="hidden sm:inline-block">
          {startItem}-{endItem} of {totalItems}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          &larr;
        </button>
        {getPageNumbers().map((page, index) =>
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-indigo-600 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-3 py-1">...</span>
          )
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
};
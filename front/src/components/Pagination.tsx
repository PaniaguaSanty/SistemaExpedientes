import React from 'react';

interface PaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, itemsPerPage, totalItems, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-8">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out
          ${currentPage === 1
            ? 'bg-blue-300 text-white cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
      >
        Previous
      </button>
      <span className="text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out
          ${currentPage === totalPages
            ? 'bg-blue-300 text-white cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
      >
        Next
      </button>
    </div>
  );
}

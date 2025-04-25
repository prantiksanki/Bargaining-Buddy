// src/components/Pagination.js
import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange, // Use a single function for simplicity
  totalResults,
  itemsPerPage
}) => {
  if (totalPages <= 1) {
    // Don't render pagination if there's only one page or less
    return null;
  }

  // --- Calculate Result Range ---
  const firstItemIndex = (currentPage - 1) * itemsPerPage + 1;
  const lastItemIndex = Math.min(currentPage * itemsPerPage, totalResults);

  // --- Page Number Generation Logic ---
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Max number of page buttons (excluding prev/next/ellipsis)
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow + 2) { // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1); // Always show first page

      let startPage = Math.max(2, currentPage - halfMaxPages);
      let endPage = Math.min(totalPages - 1, currentPage + halfMaxPages);

      // Adjust if near the beginning
      if (currentPage - halfMaxPages <= 2) {
        endPage = Math.min(totalPages - 1, maxPagesToShow);
      }
      // Adjust if near the end
      if (currentPage + halfMaxPages >= totalPages - 1) {
        startPage = Math.max(2, totalPages - maxPagesToShow + 1);
      }

      if (startPage > 2) {
        pageNumbers.push('...'); // Ellipsis before middle pages
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push('...'); // Ellipsis after middle pages
      }

      pageNumbers.push(totalPages); // Always show last page
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  // --- Button Click Handlers ---
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

  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage) {
      onPageChange(page);
    }
  };


  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-12 px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg shadow-sm sm:px-6">
      {/* Results Count */}
      <div className="text-sm text-gray-700 mb-2 sm:mb-0">
        Showing <span className="font-medium">{firstItemIndex}</span>
        {' '}to <span className="font-medium">{lastItemIndex}</span>
        {' '}of <span className="font-medium">{totalResults}</span> results
      </div>

      {/* Pagination Controls */}
      <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeft className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300"
            >
              <MoreHorizontal className="w-5 h-5" />
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 focus:z-10 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 ${
                page === currentPage
                  ? 'z-10 bg-green-50 border-green-500 text-green-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span className="sr-only">Next</span>
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
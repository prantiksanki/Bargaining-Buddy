import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, Tag, ChevronRight, FilterX, ChevronLeft } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export default function SearchResult() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { name } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
            q: name,
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            sort: sortBy
        });

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params.append(key, value);
            }
        });

        const apiUrl = `http://localhost:5000/search?${params.toString()}`;
        console.log("Fetching:", apiUrl);

        const response = await fetch(apiUrl);
        console.log(response);

        if (!response.ok) {
          let errorMsg = 'Failed to fetch products';
          try { const errData = await response.json(); errorMsg = errData.error || errData.message || errorMsg; } catch(e) {}
          throw new Error(errorMsg);
        }

        const data = await response.json();
        console.log("API Response Data:", data);

        setProducts(data.results || []);
        setTotalPages(data.totalPages || 0);
        setTotalResults(data.totalResults || 0);

        if (data.currentPage && data.totalPages && data.currentPage > data.totalPages) {
            setCurrentPage(data.totalPages > 0 ? data.totalPages : 1);
        } else {
            setCurrentPage(data.currentPage || 1);
        }

      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setProducts([]);
        setTotalPages(0);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [name, currentPage, sortBy, filters]);

  const handleViewDetails = (productId) => {
    navigate(`/comparison?search=${encodeURIComponent(productId)}`);
  };

  const handlePreviousPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  const handleNextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterButtonClick = () => {
    console.log("Filter button clicked - Placeholder - Implement Filter UI");
    setIsFilterOpen(true);
  };

   const applyFilters = (newFilters) => {
       setFilters(newFilters);
       setCurrentPage(1);
       setIsFilterOpen(false);
       console.log("Applying filters:", newFilters);
   };


  if (loading) {
    return (
       <div className="flex items-center justify-center min-h-screen bg-gray-50">
         <div className="flex flex-col items-center text-blue-600 animate-pulse">
           <div className="w-16 h-16 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
           <p className="mt-4 font-medium text-gray-700">Searching for products...</p>
         </div>
       </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center mb-2">
              <Search className="w-5 h-5 mr-2 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Search Results for "{name}"
              </h1>
            </div>
            <p className="text-gray-600">
              Found {totalResults} {totalResults === 1 ? 'product' : 'products'}
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </p>
          </div>
          <div className="flex mt-4 space-x-2 md:mt-0">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
            <button
              onClick={handleFilterButtonClick}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Filter
            </button>
          </div>
        </div>

        {error && (
             <div className="flex flex-col items-center justify-center p-10 bg-red-50 rounded-lg shadow border border-red-200">
               <FilterX className="w-12 h-12 mb-4 text-red-500" />
               <div className="text-xl font-semibold text-red-600">Error: {error}</div>
               <p className="mt-2 text-gray-600">Could not fetch results. Please try again later.</p>
             </div>
         )}

        {!loading && !error && products.length === 0 && (
            <div className="flex flex-col items-center justify-center p-10 bg-yellow-50 rounded-lg shadow border border-yellow-200">
               <Search className="w-12 h-12 mb-4 text-yellow-600" />
               <div className="text-xl font-semibold text-yellow-800">No Products Found</div>
               <p className="mt-2 text-gray-600">Your search for "{name}" did not match any products in our database.</p>
             </div>
         )}

        {products.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => {
                if (product.image && product.image.endsWith("rsz_blank_grey.jpg")) {
                  return null;
                }
                return (
                  <div key={product.id} className="overflow-hidden transition-shadow duration-200 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md">
                     <div className="h-48 overflow-hidden bg-gray-100">
                        <img
                          src={product.image || '/api/placeholder/400/320'}
                          alt={product.title}
                          className="object-cover w-full h-full"
                         />
                      </div>
                      <div className="p-5">
                         <div className="mb-2">
                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                             <Tag className="w-3 h-3 mr-1" />
                             {product.category || 'Uncategorized'}
                           </span>
                         </div>
                         <h3 className="mb-1 text-lg font-medium text-gray-900 line-clamp-2">
                           {product.title ? (product.title.length > 40 ? product.title.slice(0, 40) + "..." : product.title) : 'No Title'}
                         </h3>
                         <div className="flex items-center justify-between mt-4">
                           <div className="text-lg font-bold text-blue-600">
                               {typeof product.price === 'number' ? `₹ ${product.price}` : product.price}
                           </div>
                           <button
                             onClick={() => handleViewDetails(product.id)}
                             className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                           >
                             Compare Prices
                             <ChevronRight className="w-4 h-4 ml-1" />
                           </button>
                         </div>
                      </div>
                   </div>
                );
              })}
            </div>
        )}

        {totalPages > 1 && (
            <div className="flex items-center justify-center mt-12">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500'}`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageClick(pageNumber)}
                    className={`px-3 py-2 text-sm font-medium border-t border-b border-gray-300 ${
                      pageNumber === currentPage
                        ? 'bg-blue-50 text-blue-600 z-10 border-blue-300'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500'}`}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </nav>
            </div>
        )}
      </div>
      {/*
       {isFilterOpen && (
           <FilterModal
               currentFilters={filters}
               onApplyFilters={applyFilters}
               onClose={() => setIsFilterOpen(false)}
           />
       )}
      */}
    </div>
  );
}
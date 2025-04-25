import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
// Added Filter icon, removed unused Tag, ChevronLeft
import { Search, Filter, ChevronRight, FilterX, Heart, Plus, Loader2 } from 'lucide-react';
import loadingAnimation from '../assets/Loading.json';
import { Player } from '@lottiefiles/react-lottie-player';
import Pagination from './Pagination'; // <-- Import the Pagination component

// --- Constants ---
const ITEMS_PER_PAGE = 12;
const API_BASE_URL = 'http://localhost:5000';

// --- Helper Functions ---
const formatPrice = (price) => {
    // Example: format numeric price, return string price as is
    if (typeof price === 'number') {
        // Using INR formatting
        return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }
    // Handle potential non-numeric strings like "Check Price" or null/undefined
    if (typeof price === 'string' && price.trim() !== '') {
        return price;
    }
    return 'N/A'; // Fallback for invalid price data
};

const truncateTitle = (title, maxLength = 60) => { // Increased default length slightly
    if (!title) return 'Untitled Product';
    if (title.length <= maxLength) return title;
    return title.slice(0, maxLength) + '...';
};


// --- Main Component ---
export default function SearchResult() {
    // --- Hooks ---
    const navigate = useNavigate();
    const { name } = useParams();
    const [searchParams] = useSearchParams();

    // --- State ---
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // Combined loading state
    const [isInitialLoad, setIsInitialLoad] = useState(true); // Track initial load vs subsequent loads
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalResults, setTotalResults] = useState(0);
    const [sortBy, setSortBy] = useState('relevance');
    const [filters, setFilters] = useState({});
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Placeholder for Filter Modal

    // --- Data Fetching ---
    // Renamed fetchProducts callback for clarity inside useEffect
    const fetchData = useCallback(async (pageToFetch, sortOption, currentFilters) => {
        setLoading(true); // Set loading true at the start of fetch
        setError(null); // Clear previous errors
        console.log(`Workspaceing: Page ${pageToFetch}, Sort: ${sortOption}, Filters:`, currentFilters);

        const params = new URLSearchParams({
            q: name,
            page: pageToFetch.toString(),
            limit: ITEMS_PER_PAGE.toString(),
            sort: sortOption,
        });

        Object.entries(currentFilters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params.append(key, value);
            }
        });

        const apiUrl = `${API_BASE_URL}/search?${params.toString()}`;
        console.log("API URL:", apiUrl);

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            console.log("API Response Status:", response.status);
            console.log("API Response Data:", data);

            if (!response.ok) {
                const errorMsg = data?.error || data?.message || `HTTP error! Status: ${response.status}`;
                throw new Error(errorMsg);
            }

            setProducts(data.results || []);
            setTotalPages(data.totalPages || 0);
            setTotalResults(data.totalResults || 0);
            // Ensure currentPage from response is used, fallback to requested page
            setCurrentPage(data.currentPage || pageToFetch);

        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || 'An unknown error occurred while fetching products.');
            // Reset state on error, keep current page or reset? Resetting might be safer.
            setProducts([]);
            setTotalPages(0);
            setTotalResults(0);
            setCurrentPage(1);
        } finally {
            setLoading(false); // Turn off loading
            setIsInitialLoad(false); // Mark initial load as complete
        }
    }, [name]); // Dependencies: only name, as other params are passed directly

    // Effect to fetch data when page, sort, or filters change
    useEffect(() => {
        // Fetch data with the current state values
        fetchData(currentPage, sortBy, filters);
        // Optional: Scroll to top when page/sort/filters change
        // window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage, sortBy, filters, fetchData]); // Depend on state variables and the memoized fetch function

    // --- Event Handlers ---

    const handleViewDetails = (productId) => {
        if (!productId) {
            console.error("Attempted to navigate with invalid productId:", productId);
            return;
        }
        navigate(`/comparison?search=${encodeURIComponent(productId)}`);
    };

    // Single Pagination Handler
    const handlePageChange = (pageNumber) => {
        // Basic validation already happens in Pagination component, but double-check
        if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
            setCurrentPage(pageNumber); // Trigger useEffect to fetch new data
        }
    };

    // Sorting Handler
    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        // Reset to page 1 whenever sorting changes to show results from the beginning
        if (currentPage !== 1) {
             setCurrentPage(1);
        } else {
            // If already on page 1, fetchData needs to be triggered by the state change anyway
            // The useEffect dependency on `sortBy` handles this.
        }
    };

    // Filter Handlers (Keep as is, assuming FilterModal interaction)
    const handleFilterButtonClick = () => {
        console.log("Filter button clicked - Open Filter Modal");
        setIsFilterOpen(true);
    };
    const applyFilters = (newFilters) => {
        setFilters(newFilters);
        if (currentPage !== 1) {
            setCurrentPage(1); // Reset page when filters change
        }
        setIsFilterOpen(false);
    };
    const clearFilters = () => {
        setFilters({});
        if (currentPage !== 1) {
            setCurrentPage(1); // Reset page when filters are cleared
        }
        setIsFilterOpen(false);
    }

    // --- Render Logic ---

    // 1. Initial Loading State (Full Screen)
    if (isInitialLoad && loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <Player
                    autoplay
                    loop
                    src={loadingAnimation}
                    style={{ height: '300px', width: '300px' }}
                />
            </div>
        );
    }

    // 2. Error State
    if (error) {
         return (
             <div className="min-h-[calc(100vh-200px)] px-4 py-8 bg-gray-50 sm:px-6 lg:px-8">
                 <div className="mx-auto max-w-7xl">
                      <div className="flex flex-col items-center justify-center p-10 text-center border border-red-200 rounded-lg shadow-sm bg-red-50/50">
                          <FilterX className="w-12 h-12 mb-4 text-red-500" />
                          <div className="text-xl font-semibold text-red-700">Search Failed</div>
                          <p className="mt-2 text-sm text-red-600">{error}</p>
                          <p className="mt-4 text-xs text-gray-500">Could not fetch results. Please check your connection or try again later.</p>
                          <button
                              // Re-trigger the last fetch attempt by using the current state
                              onClick={() => fetchData(currentPage, sortBy, filters)}
                              className="px-4 py-2 mt-6 text-sm font-medium text-white transition-colors bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                              Retry Search
                          </button>
                      </div>
                 </div>
             </div>
         );
    }

    // 3. No Results State (after loading and no error)
    if (!loading && !error && products.length === 0) {
        return (
             <div className="min-h-[calc(100vh-200px)] px-4 py-8 bg-gray-50 sm:px-6 lg:px-8">
                 <div className="mx-auto max-w-7xl">
                      {/* Header - useful context even with no results */}
                      <div className="mb-8">
                          <h1 className="mb-2 text-2xl font-bold text-gray-900">Search Results for "{name}"</h1>
                          <p className="text-sm text-gray-600">Found 0 products matching your criteria.</p>
                      </div>
                      <div className="flex flex-col items-center justify-center p-10 text-center border border-yellow-300 rounded-lg shadow-sm bg-yellow-50/50">
                          <Search className="w-12 h-12 mb-4 text-yellow-600" />
                          <div className="text-xl font-semibold text-yellow-800">No Products Found</div>
                          <p className="mt-2 text-sm text-gray-600">
                               Your search "{name}" did not match any products.
                          </p>
                          <p className="mt-1 text-xs text-gray-500">Try adjusting your search terms or filters.</p>
                          {Object.keys(filters).length > 0 && (
                               <button
                                   onClick={clearFilters}
                                   className="flex items-center gap-1 px-3 py-1 mt-5 text-xs font-medium text-yellow-900 transition-colors bg-yellow-200 rounded-full hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-500"
                               >
                                   <FilterX size={14} /> Clear Filters
                               </button>
                           )}
                      </div>
                 </div>
             </div>
         );
    }


    // 4. Results Found - Main Content
    return (
        // Use a subtle background
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
            <div className="max-w-[1400px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* --- Header & Controls --- */}
                <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between md:gap-8">
                    {/* Left side: Title & Result Count */}
                    <div className='flex-shrink-0'>
                        <h1 className="text-3xl font-bold text-gray-800">Search Results</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Showing results for: <span className='font-medium text-gray-700'>"{name}"</span>
                            {totalResults > 0 && ` (${totalResults} found)`}
                        </p>
                    </div>

                    {/* Right side: Search Bar / Sort / Filter */}
                    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:flex-grow md:flex-grow-0">
                        {/* Simplified Search Bar within results */}
                         {/* <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                            <input type="text" placeholder="Refine search..." className="..." />
                            <Search className="absolute w-4 h-4 text-gray-400 right-3 top-1/2 -translate-y-1/2" />
                        </div> */}

                        {/* Sort Dropdown */}
                        <div className="relative flex-shrink-0">
                            <select
                                id="sort"
                                value={sortBy}
                                onChange={handleSortChange}
                                className="block w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pl-3 pr-8 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                            >
                                <option value="relevance">Sort: Relevance</option>
                                <option value="price_asc">Sort: Price Low-High</option>
                                <option value="price_desc">Sort: Price High-Low</option>
                                {/* <option value="rating_desc">Sort: Rating</option> */}
                            </select>
                             <ChevronRight className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none transform rotate-90" />
                        </div>

                        {/* Filter Button (Placeholder for Modal) */}
                        <button
                            onClick={handleFilterButtonClick}
                            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                        >
                            <Filter size={16} /> Filters {Object.keys(filters).length > 0 && `(${Object.keys(filters).length})`}
                        </button>
                    </div>
                </div>


                {/* --- Inline Loading Indicator --- */}
                 {loading && !isInitialLoad && ( // Show only on subsequent loads
                     <div className="flex items-center justify-center py-6 text-sm text-gray-500">
                         <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                         Loading more products...
                     </div>
                 )}

                {/* --- Product Grid --- */}
                {/* Use opacity transition for smoother loading appearance */}
                <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-opacity duration-300 ${loading && !isInitialLoad ? 'opacity-50' : 'opacity-100'}`}>
                    {products.map((product) => (
                        <div
                            key={product.id || `product-${Math.random()}`} // Improved fallback key
                            className="relative flex flex-col overflow-hidden transition-all duration-300 bg-white border border-gray-200 group rounded-xl hover:shadow-md"
                        >
                             {/* Favorite Button */}
                            <button className="absolute z-10 p-1.5 transition-colors duration-200 bg-white/60 rounded-full shadow-sm right-3 top-3 backdrop-blur-sm hover:bg-white">
                                <Heart className="w-4 h-4 text-gray-500 hover:text-red-500" />
                            </button>

                            {/* Product Image */}
                            <div className="relative w-full overflow-hidden cursor-pointer aspect-square bg-gray-100" onClick={() => handleViewDetails(product.id)}>
                                <img
                                    src={product.image || '/placeholder-image.svg'}
                                    alt={product.title || 'Product Image'}
                                    className="object-contain w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
                                    loading="lazy" // Add lazy loading for images below the fold
                                    onError={(e) => { e.target.onerror = null; e.target.src='/placeholder-image.svg'; }}
                                />
                            </div>

                            {/* Product Info Area */}
                            <div className="flex flex-col flex-grow p-4 space-y-3">
                                <h3
                                    className="text-sm font-semibold leading-snug text-gray-800 transition-colors cursor-pointer hover:text-green-700 line-clamp-2"
                                    onClick={() => handleViewDetails(product.id)}
                                    title={product.title} // Tooltip for full title
                                >
                                    {truncateTitle(product.title)} {/* Use helper */}
                                </h3>

                                {/* Price & Action - Moved to bottom */}
                                <div className="flex items-center justify-between pt-1 mt-auto">
                                     <span className="text-base font-bold text-green-700">
                                         {formatPrice(product.price)} {/* Use helper */}
                                     </span>
                                    <button
                                        onClick={() => handleViewDetails(product.id)}
                                        className="px-3 py-1 text-xs font-medium text-white transition-colors duration-200 bg-green-600 rounded-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 whitespace-nowrap"
                                    >
                                        Details <ChevronRight className="inline w-3 h-3 -mr-0.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                {/* --- Pagination Component --- */}
                {/* Render pagination only if there are results and more than one page */}
                { !loading && totalPages > 1 && ( // Also hide pagination during load for cleaner look
                    <div className="mt-10"> {/* Add margin top */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            totalResults={totalResults}
                            itemsPerPage={ITEMS_PER_PAGE}
                        />
                    </div>
                )}

            </div> {/* End max-w container */}

            {/* Filter Modal Placeholder - Render based on isFilterOpen state */}
            {/* {isFilterOpen && <FilterModal onClose={() => setIsFilterOpen(false)} onApply={applyFilters} />} */}

        </div> /* End main div */
    );
}

// --- FilterModal Component (Example Structure - Implement Separately) ---
/*
const FilterModal = ({ onClose, onApply }) => {
    // ... state for filter options (price range, category, brand, etc.)
    const handleApply = () => {
        // const appliedFilters = { price_min: ..., brand: ... };
        // onApply(appliedFilters);
    };
    return (
        <div className="fixed inset-0 z-50 ..."> // Overlay
            <div className="bg-white p-6 ..."> // Modal Content
                 <h2>Filters</h2>
                 // Filter options UI (sliders, checkboxes, etc.)
                 <button onClick={handleApply}>Apply Filters</button>
                 <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}
*/
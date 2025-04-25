import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Search, Tag, ChevronRight, FilterX, ChevronLeft, Heart, Plus } from 'lucide-react';
import loadingAnimation from '../assets/Loading.json'; // Renamed to avoid conflict
import { Player } from '@lottiefiles/react-lottie-player';


// --- Constants ---
const ITEMS_PER_PAGE = 12; // Number of products to display per page
const API_BASE_URL = 'http://localhost:5000'; // Centralized API base URL

// --- Helper Functions (Optional but good practice) ---
const formatPrice = (price) => {
    // Example: format numeric price, return string price as is
    if (typeof price === 'number') {
        // You might want more sophisticated currency formatting
        return `₹ ${price.toLocaleString('en-IN')}`;
    }
    return price; // Return as is if it's already a string like "Check Price"
};

const truncateTitle = (title, maxLength = 50) => {
    if (!title) return 'Untitled Product';
    if (title.length <= maxLength) return title;
    return title.slice(0, maxLength) + '...';
};

// --- Main Component ---
export default function SearchResult() {
    // --- Hooks ---
    const navigate = useNavigate(); // For navigation
    const { name } = useParams(); // Get search term from URL path parameter (:name)
    const [searchParams] = useSearchParams(); // To potentially read other params if needed

    // --- State ---
    const [products, setProducts] = useState([]); // Stores the fetched product results
    const [loading, setLoading] = useState(true); // Loading indicator state
    const [error, setError] = useState(null); // Stores any fetch errors

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1); // Current page number
    const [totalPages, setTotalPages] = useState(0); // Total pages available
    const [totalResults, setTotalResults] = useState(0); // Total number of results found

    // Sorting & Filtering State
    const [sortBy, setSortBy] = useState('relevance'); // Current sorting option
    const [filters, setFilters] = useState({}); // Active filters (implement FilterModal)
    const [isFilterOpen, setIsFilterOpen] = useState(false); // To control filter modal visibility

    // --- Data Fetching Effect ---
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        console.log(`Workspaceing: Page ${currentPage}, Sort: ${sortBy}, Filters:`, filters);

        // Construct query parameters
        const params = new URLSearchParams({
            q: name, // Search query from URL param
            page: currentPage.toString(),
            limit: ITEMS_PER_PAGE.toString(),
            sort: sortBy,
        });

        // Add active filters to parameters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params.append(key, value);
            }
        });

        const apiUrl = `${API_BASE_URL}/search?${params.toString()}`;
        console.log("API URL:", apiUrl);

        try {
            const response = await fetch(apiUrl);
            const data = await response.json(); // Attempt to parse JSON regardless of status

            console.log("API Response Status:", response.status);
            console.log("API Response Data:", data);

            if (!response.ok) {
                // Use error message from backend if available, otherwise use status text
                const errorMsg = data?.error || data?.message || `HTTP error! Status: ${response.status}`;
                throw new Error(errorMsg);
            }

            // --- Update State with Fetched Data ---
            setProducts(data.results || []);
            setTotalPages(data.totalPages || 0);
            setTotalResults(data.totalResults || 0);

            // Adjust current page if it's out of bounds (e.g., after filtering)
            const receivedCurrentPage = data.currentPage || 1;
            const maxPage = data.totalPages || 1; // Ensure at least 1 page exists conceptually
            setCurrentPage(Math.max(1, Math.min(receivedCurrentPage, maxPage)));

        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || 'An unknown error occurred while fetching products.');
            // Reset state on error
            setProducts([]);
            setTotalPages(0);
            setTotalResults(0);
            setCurrentPage(1); // Reset to page 1 on error
        } finally {
            setLoading(false); // Ensure loading is turned off
        }
    }, [name, currentPage, sortBy, filters]); // Dependencies for useCallback

    // Run fetchProducts when dependencies change
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]); // Now depends on the memoized fetchProducts function

    // --- Event Handlers ---

    // Navigate to the comparison page with the product ID
    const handleViewDetails = (productId) => {
        if (!productId) {
            console.error("Attempted to navigate with invalid productId:", productId);
            return;
        }
        // This uses the search query parameter pattern: /comparison?search=PRODUCT_ID
        navigate(`/comparison?search=${encodeURIComponent(productId)}`);
    };

    // Pagination Handlers
    const handlePreviousPage = () => {
        // Prevent going below page 1
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };
    const handleNextPage = () => {
        // Prevent going beyond the last page
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };
    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Sorting Handler
    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        setCurrentPage(1); // Reset to page 1 when sorting changes
    };

    // Filter Handlers (Placeholders - requires FilterModal implementation)
    const handleFilterButtonClick = () => {
        console.log("Filter button clicked - Open Filter Modal");
        setIsFilterOpen(true); // You would show a modal here
    };

    const applyFilters = (newFilters) => {
        console.log("Applying filters:", newFilters);
        setFilters(newFilters); // Update filter state
        setCurrentPage(1); // Reset to page 1 when filters change
        setIsFilterOpen(false); // Close the modal
    };

    const clearFilters = () => {
        console.log("Clearing filters");
        setFilters({});
        setCurrentPage(1);
        setIsFilterOpen(false);
    }

    // --- Render Logic ---

    // 1. Loading State
    if (loading) {
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
            <div className="min-h-[calc(100vh-200px)] px-4 py-8 bg-green-50 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                     <div className="flex flex-col items-center justify-center p-10 text-center border border-red-200 rounded-lg shadow bg-red-50">
                        <FilterX className="w-12 h-12 mb-4 text-red-500" />
                        <div className="text-xl font-semibold text-red-700">Search Failed</div>
                        <p className="mt-2 text-sm text-red-600">{error}</p>
                        <p className="mt-4 text-gray-600">Could not fetch results. Please check your connection or try again later.</p>
                        <button
                            onClick={() => window.location.reload()} // Simple retry: reload page
                            className="px-4 py-2 mt-6 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
             <div className="min-h-[calc(100vh-200px)] px-4 py-8 bg-green-50 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Header is still useful */}
                    <div className="mb-8">
                         <h1 className="mb-2 text-2xl font-bold text-gray-900">Search Results for "{name}"</h1>
                         <p className="text-gray-600">Found 0 products matching your search.</p>
                     </div>
                    <div className="flex flex-col items-center justify-center p-10 text-center border border-yellow-200 rounded-lg shadow bg-yellow-50">
                        <Search className="w-12 h-12 mb-4 text-yellow-600" />
                        <div className="text-xl font-semibold text-yellow-800">No Products Found</div>
                        <p className="mt-2 text-gray-600">
                            Your search for "{name}" did not match any products. Try refining your search terms.
                        </p>
                         {Object.keys(filters).length > 0 && (
                            <button
                                onClick={clearFilters}
                                className="px-3 py-1 mt-4 text-sm font-medium text-yellow-800 bg-yellow-200 rounded-md hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-500"
                            >
                                Clear Filters and Search Again
                            </button>
                        )}
                    </div>
                 </div>
            </div>
        );
    }

    // 4. Results Found - Main Content
    return (
        <div className="min-h-screen bg-green-100">
            <div className="max-w-[1400px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col gap-6 mb-12">
                    <h1 className="text-5xl font-bold text-gray-900">Search Results</h1>
                    <p className="text-gray-600">← For {name}</p>

                    {/* Search Bar */}
                    <div className="flex items-center justify-between">
                        <div className="relative flex-1 max-w-xl">
                            <input
                                type="text"
                                placeholder="Search products"
                                className="w-full px-6 py-3 bg-white rounded-full shadow-sm pr-14"
                            />
                            <div className="absolute flex items-center gap-2 -translate-y-1/2 right-2 top-1/2">
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Masonry Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="relative p-6 transition-all duration-300 bg-white group rounded-3xl hover:shadow-lg"
                        >
                            {/* Favorite Button */}
                            <button className="absolute z-10 p-2 right-4 top-4">
                                <Heart className="w-5 h-5 text-gray-400 transition-colors duration-300 group-hover:text-red-500" />
                            </button>

                            {/* Product Image */}
                            <div className="relative mb-4 overflow-hidden rounded-2xl aspect-square">
                                <img
                                    src={product.image || '/placeholder-image.svg'}
                                    alt={product.title}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="space-y-2">
                                <div className="flex items-start justify-between">
                                    <h3 className="pr-8 text-lg font-semibold text-gray-900">{product.title}</h3>
                                    <span className="text-gray-400">↗</span>
                                </div>
                                <p className="text-sm text-gray-500">{product.description}</p>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm text-gray-500">+</span>
                                        <span className="font-medium">{product.price}</span>
                                    </div>
                                    <button
                                        onClick={() => handleViewDetails(product.id)}
                                        className="px-4 py-2 text-sm font-medium text-white transition-colors bg-green-500 rounded-full hover:bg-green-600"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
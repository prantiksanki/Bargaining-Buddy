import React, { useState, useEffect, useCallback } from 'react';
import { Search, MessageSquareText, ChevronRight, Loader2, AlertTriangle } from 'lucide-react'; // Added Loader2, AlertTriangle
import { useNavigate } from 'react-router-dom';

// Assuming formatPrice helper is available or defined here
const formatPrice = (price) => {
  if (typeof price === 'number') {
    return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }
  if (typeof price === 'string' && price.trim() !== '') {
    return price;
  }
  return 'N/A';
};

const API_BASE_URL = 'http://localhost:5000'; // Centralize API URL

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]); // For suggestions list
  const [filtered, setFiltered] = useState([]); // Filtered suggestions

  // State for the featured product showcase
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(null);

  const navigate = useNavigate();

  // --- Data Fetching for Search Suggestions ---
  useEffect(() => {
    const fetchSuggestionProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/product/recent-searches`);
        if (!res.ok) {
          throw new Error(`API fetch failed with status: ${res.status}`);
        }
        const data = await res.json();
        // Ensure data is an array and extract product info safely
        const recentProducts = Array.isArray(data) ? data.map(item => item?.product).filter(Boolean) : [];
        setProducts(recentProducts);
      } catch (err) {
        console.error('API fetch error for recent searches:', err);
        setProducts([]);
      }
    };
    fetchSuggestionProducts();
  }, []);

  // --- Data Fetching for Featured Product Showcase ---
  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      setIsFeaturedLoading(true);
      setFeaturedError(null);
      setFeaturedProduct(null); // Reset previous product

      try {
        // Step 1: Get the ID from recent searches
        const recentRes = await fetch(`${API_BASE_URL}/product/recent-searches`);
        if (!recentRes.ok) {
          throw new Error(`Failed to fetch recent searches: ${recentRes.status}`);
        }
        const recentData = await recentRes.json();


        console.log('Recent Searches Data:', recentData); // Debugging line

        // Find the first valid product ID from the recent searches list
      
        const firstProductId = recentData.length > 0 ? recentData[0]._id : null;

        if (!firstProductId) {
          throw new Error('No recent products found to feature.');
        }

        // Step 2: Fetch detailed product data using the ID
        const productRes = await fetch(`${API_BASE_URL}/products/${firstProductId}`);
        if (!productRes.ok) {
          // Attempt to parse error message from backend if available
          let errorMsg = `Failed to fetch product details: ${productRes.status}`;
           try {
                const errorData = await productRes.json();
                errorMsg = errorData?.message || errorData?.error || errorMsg;
           } catch (parseError) {
               // Ignore if response is not JSON or empty
           }
          throw new Error(errorMsg);
        }
        const productData = await productRes.json();
        setFeaturedProduct(productData);


        console.log('Featured Product Data:', productData); // Debugging line

      } catch (err) {
        console.error('Error fetching featured product:', err);
        setFeaturedError(err.message || 'Could not load featured product.');
      } finally {
        setIsFeaturedLoading(false);
      }
    };

    fetchFeaturedProduct();
  }, []); // Run only once on mount

  // --- Client-Side Filtering for Search Suggestions ---
  useEffect(() => {
    if (query.trim() === '') {
      setFiltered([]);
    } else {
      const matches = products.filter((product) =>
        (product?.title || '').toLowerCase().includes(query.toLowerCase())
      );
      setFiltered(matches.slice(0, 6));
    }
  }, [query, products]);

  // --- Navigation Handlers ---
  const handleSearchSubmit = () => {
    if (query.trim()) {
      navigate(`/result/${encodeURIComponent(query.trim())}`);
      setQuery('');
      setFiltered([]);
    }
  };

  const handleSuggestionClick = (item) => {
    const searchTerm = item.id || item.title; // Prefer ID if available for comparison page
    setQuery(item.title || '');
    setFiltered([]);
    navigate(`/comparison?search=${encodeURIComponent(searchTerm)}`);
  };

  // --- Helper to get data safely for the featured card ---
  const getFeaturedData = () => {
      if (!featuredProduct) return {};

      const title = featuredProduct.title || 'Product Title';
      const image = featuredProduct.image || '/placeholder-image.svg'; // Provide a fallback image
      // Use lowestPrice if available, otherwise find min from prices array, fallback to N/A
      const currentPrice = typeof featuredProduct.lowestPrice === 'number'
          ? featuredProduct.lowestPrice
          : (featuredProduct.prices?.length > 0 ? Math.min(...featuredProduct.prices.map(p => p.price)) : null);

      // Get MRP from the first retailer, fallback needed
      const originalPrice = featuredProduct.prices?.[0]?.mrp;

      // Get unique store names
      const stores = featuredProduct.prices ? [...new Set(featuredProduct.prices.map(p => p.retailer))] : [];

      return {
          title,
          image,
          // Only show original price if it's higher than current price
          originalPrice: (typeof originalPrice === 'number' && typeof currentPrice === 'number' && originalPrice > currentPrice) ? originalPrice : null,
          currentPrice: typeof currentPrice === 'number' ? currentPrice : null,
          stores,
          // Navigate to comparison page for this specific product
          compareUrl: `/comparison?search=${encodeURIComponent(featuredProduct._id)}`
      };
  };

  const featured = getFeaturedData(); // Get processed data for rendering

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-gray-200">
      <div className="relative z-10 flex flex-col items-center px-4 py-16 mx-auto md:flex-row max-w-7xl sm:px-6 lg:px-8 md:py-24">

        {/* Left Content: Headline, Search */}
        <div className="w-full md:w-1/2 md:pr-12 text-center md:text-left">
           {/* ... (Headline, Description, Search Bar, Suggestions, Feature Buttons remain the same) ... */}
           <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
             Stop overpaying.
             <br />
             <span className="text-emerald-600">Start saving smarter.</span>
           </h1>
           <p className="mt-4 text-lg text-gray-600 md:mt-6">
             Real-time price tracking across Amazon, Flipkart, and more. Find the best deals effortlessly.
           </p>

           {/* Search Bar & Suggestions */}
           <div className="relative mt-8 md:mt-10 max-w-xl mx-auto md:mx-0">
             <div className="flex items-center">
               <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for products (e.g., iPhone 15)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                    className="block w-full py-3 pl-12 pr-4 text-gray-900 transition-all duration-300 bg-white border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400"
                  />
               </div>
               <button
                  onClick={handleSearchSubmit}
                  className="flex-shrink-0 px-5 py-3 ml-2 text-sm font-semibold text-white transition-colors duration-300 rounded-full shadow-md bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                 Search
               </button>
             </div>

             {/* Dropdown for filtered search results */}
             {filtered.length > 0 && (
               <div className="absolute left-0 right-0 z-20 mt-1 overflow-hidden origin-top bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5">
                 <ul className="py-1 overflow-y-auto max-h-60">
                   {filtered.map((item, index) => (
                     <li
                       key={item.id || index}
                       className="px-4 py-2 text-sm text-gray-700 transition-colors duration-150 cursor-pointer hover:bg-emerald-50 hover:text-emerald-800"
                       onMouseDown={() => handleSuggestionClick(item)}
                     >
                       {item.title}
                     </li>
                   ))}
                 </ul>
               </div>
             )}
           </div>

            {/* Feature Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mt-8 md:justify-start md:mt-10">
                 <button className="px-4 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300">
                   Top Electronics
                 </button>
                 <button className="px-4 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300">
                   Fashion Deals
                 </button>
                 <button className="px-4 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300">
                   Grocery Savings
                 </button>
            </div>
        </div>

        {/* Right Content - Dynamic Product Showcase */}
        <div className="relative flex items-center justify-center w-full max-w-md mt-12 md:w-1/2 md:mt-0 md:pl-8 lg:pl-16">
          {/* Container to maintain size during loading/error */}
          <div className="w-full min-h-[480px] flex items-center justify-center bg-emerald-500 rounded-[32px] shadow-xl p-6">
            {isFeaturedLoading ? (
              <div className="flex flex-col items-center text-white">
                <Loader2 className="w-10 h-10 animate-spin text-white/80" />
                <p className="mt-3 text-sm text-white/80">Loading featured deal...</p>
              </div>
            ) : featuredError ? (
              <div className="flex flex-col items-center text-center text-white">
                 <AlertTriangle className="w-10 h-10 text-yellow-300" />
                 <p className="mt-3 text-sm font-medium text-yellow-100">Error Loading Deal</p>
                 <p className="mt-1 text-xs text-white/80">{featuredError}</p>
               </div>
            ) : featuredProduct ? (
              // Main Card Content - Rendered only when data is ready
              <div className="relative flex flex-col items-center w-full"> {/* Removed bg/rounding from here */}
                {/* External Link / Action Button */}
                <button className="absolute z-10 p-2 transition-colors duration-200 bg-white rounded-full shadow top-[-10px] right-[-10px] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-300"> {/* Adjusted position */}
                    <MessageSquareText className="w-4 h-4 text-emerald-700" />
                </button>

                 {/* Product Image Area */}
                <div className="relative flex items-center justify-center w-full mb-6 bg-black rounded-xl h-52">
                    <div className="p-4">
                       <img
                         src={featured.image}
                         alt={featured.title}
                         className="object-contain h-40 max-w-full"
                         onError={(e) => { e.target.onerror = null; e.target.src='/placeholder-image.svg'; }} // Add fallback
                       />
                    </div>
                </div>

                 {/* Product Info */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white line-clamp-2" title={featured.title}>{featured.title}</h3>
                  <div className="flex items-baseline justify-center mt-2 space-x-2">
                    {/* Conditionally render original price */}
                    {featured.originalPrice && (
                        <span className="text-base text-white line-through text-opacity-70">
                            {formatPrice(featured.originalPrice)}
                        </span>
                    )}
                    {/* Display current (lowest) price */}
                    <span className="text-2xl font-bold text-white">
                        {featured.currentPrice !== null ? formatPrice(featured.currentPrice) : 'Price Unavailable'}
                    </span>
                  </div>
                </div>

                 {/* Stores Available */}
                <div className="w-full mt-6">
                  <div className="mb-2 text-sm font-medium text-white text-opacity-90">Available at:</div>
                  <div className="space-y-2 max-h-24 overflow-y-auto pr-1"> {/* Limit height and add scroll */}
                    {featured.stores.length > 0 ? featured.stores.map((store, index) => (
                      <div key={`${store}-${index}`} className="flex items-center justify-between p-2 transition-colors duration-200 bg-white rounded-lg cursor-pointer bg-opacity-10 hover:bg-opacity-20"> {/* Adjusted padding */}
                        <span className="text-xs text-white truncate">{store}</span>
                        <ChevronRight className="w-4 h-4 text-white text-opacity-70 flex-shrink-0 ml-2" />
                      </div>
                    )) : (
                         <p className="text-xs text-center text-white text-opacity-70">No online stores found.</p>
                    )}
                  </div>
                </div>

                 {/* Compare Button - Now navigates */}
                <button
                   onClick={() => featured.compareUrl && navigate(featured.compareUrl)}
                   disabled={!featured.compareUrl}
                   className="mt-8 px-8 py-3 text-base font-semibold transition-colors duration-200 bg-white rounded-full shadow-lg text-emerald-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                  Compare Prices
                </button>
              </div>
            ) : (
                 // Fallback if product is null but no error/loading (shouldn't happen often)
                 <div className="text-center text-white text-opacity-70">No featured product available.</div>
            )}
          </div> {/* End Loading/Error/Content Wrapper */}
        </div> {/* End Right Content */}

      </div> {/* End Main Flex Container */}
    </div> /* End Hero Section */
  );
};

export default HeroSection;
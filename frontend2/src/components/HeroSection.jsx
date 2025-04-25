import React, { useState, useEffect, useCallback } from 'react';
// Icons
import { Search, ExternalLink, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Helper Functions ---
const formatPrice = (price) => {
  if (typeof price === 'number' && !isNaN(price)) {
    return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }
  if (typeof price === 'string' && price.trim() !== '') {
    return price;
  }
  return 'N/A';
};

const API_BASE_URL = 'http://localhost:5000';

// --- Main Component ---
const HeroSection = () => {
  // --- State ---
  const [query, setQuery] = useState('');
  const [suggestionProducts, setSuggestionProducts] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(null);
  const [isCardHovered, setIsCardHovered] = useState(false); // Re-added for hover effect

  const navigate = useNavigate();

  // --- Data Fetching ---

  // Effect 1: Fetch suggestions
  useEffect(() => {
    const fetchSuggestionData = async () => {
      // console.log("Fetching data for search suggestions..."); // Keep logging minimal for production
      try {
        const res = await fetch(`${API_BASE_URL}/products/recent-searches`);
        if (!res.ok) {
          throw new Error(`API fetch failed (suggestions): ${res.status}`);
        }
        const data = await res.json();
        // console.log("Raw suggestion data received:", { data });
        const recentProducts = Array.isArray(data) ? data.map(item => item?.product).filter(Boolean) : [];
        // console.log("Processed suggestion products:", { recentProducts });
        setSuggestionProducts(recentProducts);
      } catch (err) {
        console.error('Error fetching suggestion products:', err);
        setSuggestionProducts([]);
      }
    };
    fetchSuggestionData();
  }, []);

  // Effect 2: Fetch featured product details
  useEffect(() => {
    const fetchFeaturedProductData = async () => {
      // console.log("Attempting to fetch featured product data...");
      setIsFeaturedLoading(true);
      setFeaturedError(null);
      setFeaturedProduct(null);

      try {
        // console.log("Fetching recent searches to find a featured product ID...");
        const recentRes = await fetch(`${API_BASE_URL}/products/recent-searches`);
        if (!recentRes.ok) {
          throw new Error(`Failed to fetch recent searches: ${recentRes.status}`);
        }
        const recentData = await recentRes.json();
        // console.log("Received recent searches list:", { recentData });

        const firstProductId = Array.isArray(recentData) ? recentData.find(item => item?.product?.id)?.product?.id : null;
        // console.log("Extracted first product ID:", { firstProductId });

        if (!firstProductId) {
          throw new Error('No valid recent product ID found to feature.');
        }

        // console.log(`Workspaceing details for product ID: ${firstProductId}...`);
        const productRes = await fetch(`${API_BASE_URL}/products/${firstProductId}`);
        if (!productRes.ok) {
           let errorMsg = `Failed to fetch product details: ${productRes.status}`;
           try {
               const errorData = await productRes.json();
               errorMsg = errorData?.message || errorData?.error || errorMsg;
           } catch (parseError) { /* Ignore */ }
          throw new Error(errorMsg);
        }
        const productData = await productRes.json();
        // console.log("Received detailed product data:", { productData });
        setFeaturedProduct(productData);

      } catch (err) {
        console.error('Error fetching featured product:', err);
        // console.log("Caught error object:", { error: err });
        setFeaturedError(err.message || 'Could not load featured product.');
      } finally {
        // console.log("Finished fetching featured product data. Loading state set to false.");
        setIsFeaturedLoading(false);
      }
    };

    fetchFeaturedProductData();
  }, []);

  // Effect 3: Filter suggestions
  useEffect(() => {
    if (query.trim() === '') {
      setFilteredSuggestions([]);
    } else {
      const matches = suggestionProducts.filter((product) =>
        (product?.title || '').toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(matches.slice(0, 6));
    }
  }, [query, suggestionProducts]);

  // --- Event Handlers ---
  const handleSearchSubmit = () => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      navigate(`/result/${encodeURIComponent(trimmedQuery)}`);
      setQuery('');
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (item) => {
    const searchTerm = item?.id || item?.title || '';
    setQuery(item?.title || '');
    setFilteredSuggestions([]);
    if (searchTerm) {
      navigate(`/comparison?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleComparePricesClick = () => {
    if (featuredProduct?._id) {
        navigate(`/comparison?search=${encodeURIComponent(featuredProduct._id)}`);
    }
  };

   // --- Helper to process featured product data ---
   const getProcessedFeaturedData = () => {
     if (!featuredProduct) return {};

     const title = featuredProduct.title || 'Product Title Not Available';
     const image = featuredProduct.image || '/placeholder-image.svg';
     const productId = featuredProduct._id;

     let currentPrice = null;
     let correspondingDiscount = null; // Variable to store discount for the lowest price

     // Find the lowest price and its corresponding discount
     if (Array.isArray(featuredProduct.prices) && featuredProduct.prices.length > 0) {
       let lowestPriceEntry = null;
       for (const entry of featuredProduct.prices) {
         const price = entry?.price;
         if (typeof price === 'number' && !isNaN(price)) {
           if (lowestPriceEntry === null || price < lowestPriceEntry.price) {
             lowestPriceEntry = entry;
           }
         }
       }

       if (lowestPriceEntry !== null) {
         currentPrice = lowestPriceEntry.price;
         // Check if discount string is valid (e.g., not '0%' or empty)
         if (lowestPriceEntry.discount && lowestPriceEntry.discount !== '0%') {
            correspondingDiscount = lowestPriceEntry.discount;
         }
       }
     }
     // Fallback using lowestPrice field if calculation failed
     if (currentPrice === null && typeof featuredProduct.lowestPrice === 'number' && !isNaN(featuredProduct.lowestPrice)){
         currentPrice = featuredProduct.lowestPrice;
         // Note: We don't have the corresponding discount if we only use lowestPrice field
     }


     let originalPrice = null;
     const firstMrp = featuredProduct.prices?.[0]?.mrp;
     if (typeof firstMrp === 'number' && !isNaN(firstMrp)) {
       originalPrice = firstMrp;
     }

     const displayOriginalPrice = (originalPrice !== null && currentPrice !== null && originalPrice > currentPrice) ? originalPrice : null;

     const stores = Array.isArray(featuredProduct.prices)
       ? [...new Set(featuredProduct.prices.map(p => p?.retailer).filter(Boolean))]
       : [];

     const processedData = {
       title,
       image,
       originalPrice: displayOriginalPrice,
       currentPrice: currentPrice,
       discountPercent: correspondingDiscount, // Added discount percentage
       stores,
       productId: productId,
     };
    //  console.log("Processed featured product data for rendering:", { processedData });
     return processedData;
   };

   const featuredData = getProcessedFeaturedData();


  // --- Render Logic ---
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-gray-200">
      <div className="relative z-10 flex flex-col items-center px-4 py-16 mx-auto md:flex-row max-w-7xl sm:px-6 lg:px-8 md:py-24">

        {/* Left Content */}
        <div className="w-full md:w-1/2 md:pr-12 text-center md:text-left">
           {/* Headline, Description, Search Bar, Suggestions, Feature Buttons */}
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
                    aria-label="Search products"
                    autoComplete="off"
                  />
               </div>
               <button
                  onClick={handleSearchSubmit}
                  className="flex-shrink-0 px-5 py-3 ml-2 text-sm font-semibold text-white transition-colors duration-300 rounded-full shadow-md bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  aria-label="Submit search"
                >
                 Search
               </button>
             </div>

             {/* Dropdown for filtered search results */}
             {filteredSuggestions.length > 0 && (
               <div className="absolute left-0 right-0 z-20 mt-1 overflow-hidden origin-top bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5">
                 <ul className="py-1 overflow-y-auto max-h-60" role="listbox">
                   {filteredSuggestions.map((item, index) => (
                     <li
                       key={item.id || index}
                       className="px-4 py-2 text-sm text-gray-700 transition-colors duration-150 cursor-pointer hover:bg-emerald-50 hover:text-emerald-800"
                       onMouseDown={() => handleSuggestionClick(item)}
                       role="option"
                       aria-selected="false"
                     >
                       {item.title || 'Suggestion Item'}
                     </li>
                   ))}
                 </ul>
               </div>
             )}
           </div>

           {/* Feature Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mt-8 md:justify-start md:mt-10">
              <button
                 onClick={() => navigate('/result/electronics')}
                 className="px-4 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300"
              >
                Top Electronics
              </button>
              <button
                  onClick={() => navigate('/result/fashion')}
                  className="px-4 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300"
              >
                Fashion Deals
              </button>
              <button
                  onClick={() => navigate('/result/grocery')}
                  className="px-4 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300"
              >
                Grocery Savings
              </button>
            </div>
        </div>

        {/* Right Content - Dynamic Product Showcase */}
        <div className="relative flex items-center justify-center w-full max-w-md mt-12 md:w-1/2 md:mt-0 md:pl-8 lg:pl-16">
          {/* Outer container for hover effect */}
          <div
            className={`relative w-full transition-transform duration-300 ease-in-out ${isCardHovered ? 'scale-105' : 'scale-100'}`}
            onMouseEnter={() => setIsCardHovered(true)}
            onMouseLeave={() => setIsCardHovered(false)}
          >
             {/* Container to maintain size and style */}
             <div className="w-full min-h-[510px] flex items-center justify-center bg-emerald-500 rounded-[32px] shadow-xl p-6 overflow-hidden">
               {isFeaturedLoading ? (
                 // Loading State UI
                 <div className="flex flex-col items-center text-center text-white animate-pulse">
                   <div className="w-full h-56 mb-6 bg-black rounded-xl opacity-50"></div> {/* Image placeholder */}
                   <div className="w-3/4 h-5 mb-3 bg-white rounded opacity-30"></div> {/* Title placeholder */}
                   <div className="w-1/2 h-6 mb-8 bg-white rounded opacity-30"></div> {/* Price placeholder */}
                   <div className="w-full h-24 bg-white rounded-lg opacity-20"></div> {/* Stores placeholder */}
                   <div className="w-3/4 h-10 mt-8 bg-white rounded-full opacity-30"></div> {/* Button placeholder */}
                 </div>
               ) : featuredError ? (
                 // Error State UI
                 <div className="flex flex-col items-center text-center text-white">
                   <AlertTriangle className="w-12 h-12 text-yellow-300" />
                   <p className="mt-3 text-sm font-semibold text-yellow-100">Oops! Error Loading Deal</p>
                   <p className="mt-1 text-xs text-white/80 max-w-xs">{featuredError}</p>
                 </div>
               ) : featuredProduct ? (
                 // Success State - Render Card Content
                 <div className="relative flex flex-col items-center w-full">
                   <button aria-label="View external link (placeholder)" className="absolute z-10 p-2 transition-colors duration-200 bg-white rounded-full shadow top-[-10px] right-[-10px] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-300">
                     <ExternalLink className="w-4 h-4 text-emerald-700" />
                   </button>

                    {/* Image Area - Slightly increased height */}
                   <div className="relative flex items-center justify-center w-full mb-6 bg-black rounded-xl h-56">
                     <div className="p-4">
                       <img
                         src={featuredData.image}
                         alt={featuredData.title}
                         // Ensure image uses object-contain and height limit
                         className="object-contain h-44 max-w-full"
                         onError={(e) => { e.target.onerror = null; e.target.src='/placeholder-image.svg'; }}
                       />
                     </div>
                   </div>

                    {/* Product Info */}
                   <div className="text-center">
                     <h3 className="text-xl font-bold text-white line-clamp-2" title={featuredData.title}>{featuredData.title}</h3>
                     {/* Price Area */}
                     <div className="flex items-baseline justify-center flex-wrap mt-2 space-x-2 min-h-[32px]">
                        {/* Original Price + Discount % */}
                        {featuredData.originalPrice && (
                            <span className="inline-flex items-baseline">
                                <span className="text-base text-white line-through text-opacity-70">
                                    {formatPrice(featuredData.originalPrice)}
                                </span>
                                {/* Display Discount % if available */}
                                {featuredData.discountPercent && (
                                    <span className="ml-1.5 inline-block bg-yellow-300 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {featuredData.discountPercent} OFF
                                    </span>
                                )}
                            </span>
                        )}
                        {/* Current Price */}
                        <span className="text-2xl font-bold text-white">
                            {formatPrice(featuredData.currentPrice)}
                        </span>
                     </div>
                   </div>

                    {/* Stores Available - Increased text size and padding */}
                   <div className="w-full mt-6">
                     <div className="mb-2 text-sm font-medium text-white text-opacity-90">Available at:</div>
                     <div className="space-y-2 max-h-28 overflow-y-auto pr-1"> {/* Adjusted max-height */}
                       {featuredData.stores.length > 0 ? featuredData.stores.map((store, index) => (
                         <div key={`${store}-${index}`} className="flex items-center justify-between p-3 transition-colors duration-200 bg-white rounded-lg cursor-pointer bg-opacity-10 hover:bg-opacity-20"> {/* Increased padding */}
                           <span className="text-sm text-white truncate">{store}</span> {/* Increased text size */}
                           <ChevronRight className="w-4 h-4 text-white text-opacity-70 flex-shrink-0 ml-2" />
                         </div>
                       )) : (
                            <p className="text-sm text-center text-white text-opacity-70">No online stores listed.</p> // Increased text size
                       )}
                     </div>
                   </div>

                    {/* Compare Button */}
                   <button
                      onClick={handleComparePricesClick}
                      disabled={!featuredData.productId}
                      className="mt-8 px-8 py-3 text-base font-semibold transition-colors duration-200 bg-white rounded-full shadow-lg text-emerald-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                     Compare Prices
                   </button>
                 </div>
               ) : (
                    // Fallback if product is null but no error/loading
                    <div className="text-center text-white text-opacity-70">No featured product to display.</div>
               )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
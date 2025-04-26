import React, { useState, useEffect, useCallback } from 'react';
import { Search, ExternalLink, ChevronRight, Loader2, AlertTriangle, Target, Zap, CheckCircle, BarChart, ShoppingBag, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const formatPrice = (price) => {
  if (typeof price === 'number' && !isNaN(price)) {
    return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }
  if (typeof price === 'string' && price.trim() !== '') {
    return price;
  }
  return 'N/A';
};

const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return 'Invalid Date';
  }
};

const API_BASE_URL = 'http://localhost:5000';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const [suggestionProducts, setSuggestionProducts] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [recentSearchLogs, setRecentSearchLogs] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState(null);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState(null);
  const [isCardHovered, setIsCardHovered] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products/recent-searches`);
        if (!res.ok) throw new Error(`API fetch failed (recent searches): ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setRecentSearchLogs(data);
          const productsForSuggestions = data.map(item => item?.product).filter(Boolean);
          setSuggestionProducts(productsForSuggestions);
        } else {
          setRecentSearchLogs([]);
          setSuggestionProducts([]);
        }
      } catch (err) {
        console.error('Error fetching recent searches data:', err);
        setRecentSearchLogs([]);
        setSuggestionProducts([]);
      }
    };
    fetchRecentData();
  }, []);

  useEffect(() => {
    const fetchFeaturedProductData = async () => {
      setIsFeaturedLoading(true);
      setFeaturedError(null);
      setFeaturedProduct(null);
      try {
        const recentRes = await fetch(`${API_BASE_URL}/products/recent-searches?limit=1`);
        if (!recentRes.ok) throw new Error(`Failed to fetch recent searches: ${recentRes.status}`);
        const recentData = await recentRes.json();
        const firstProductId = Array.isArray(recentData) ? recentData.find(item => item?.product?.id)?.product?.id : null;
        if (!firstProductId) throw new Error('No valid recent product ID found to feature.');
        const productRes = await fetch(`${API_BASE_URL}/products/${firstProductId}`);
        if (!productRes.ok) {
           let errorMsg = `Failed to fetch product details: ${productRes.status}`;
           try { const errorData = await productRes.json(); errorMsg = errorData?.message || errorData?.error || errorMsg; } catch (e) {}
          throw new Error(errorMsg);
        }
        const productData = await productRes.json();
        setFeaturedProduct(productData);
      } catch (err) {
        console.error('Error fetching featured product:', err);
        setFeaturedError(err.message || 'Could not load featured product.');
      } finally {
        setIsFeaturedLoading(false);
      }
    };
    fetchFeaturedProductData();
  }, []);

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

  const handleNavigateToComparison = (productId) => {
      if (productId) {
          navigate(`/comparison?search=${encodeURIComponent(productId)}`);
      }
  };

  const getProcessedFeaturedData = () => {
     if (!featuredProduct) return {};
     const title = featuredProduct.title || 'Product Title Not Available';
     const image = featuredProduct.image || '/placeholder-image.svg';
     const productId = featuredProduct._id;
     let currentPrice = null;
     let correspondingDiscount = null;
     let originalPrice = null;
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
         if (lowestPriceEntry.discount && lowestPriceEntry.discount !== '0%') {
            correspondingDiscount = lowestPriceEntry.discount;
         }
       }
       const firstMrp = featuredProduct.prices[0]?.mrp;
       if (typeof firstMrp === 'number' && !isNaN(firstMrp)) { originalPrice = firstMrp; }
     }
     if (currentPrice === null && typeof featuredProduct.lowestPrice === 'number' && !isNaN(featuredProduct.lowestPrice)){
         currentPrice = featuredProduct.lowestPrice;
     }
     const displayCurrentPrice = currentPrice;
     const displayOriginalPriceSlashed = (originalPrice !== null && displayCurrentPrice !== null && originalPrice > displayCurrentPrice) ? originalPrice : null;
     const stores = Array.isArray(featuredProduct.prices) ? [...new Set(featuredProduct.prices.map(p => p?.retailer).filter(Boolean))] : [];
     return { title, image, originalPriceSlashed: displayOriginalPriceSlashed, currentPrice: displayCurrentPrice, discountPercent: correspondingDiscount, stores, productId };
   };

   const featuredData = getProcessedFeaturedData();

  return (
    <div className="relative overflow-hidden bg-gray-100">

      <div className="relative z-10 px-4 pt-16 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8 md:pt-24 md:pb-16">
        <div className="flex flex-col items-center md:flex-row">
            <div className="w-full md:w-1/2 md:pr-12 text-center md:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Stop overpaying.
                <br />
                <span className="text-emerald-600">Start saving smarter.</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 md:mt-6">
                Real-time price tracking across Amazon, Flipkart, and more. Find the best deals effortlessly.
              </p>
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
              <div className="flex flex-wrap justify-center gap-3 mt-8 md:justify-start md:mt-10">
                 <button onClick={() => navigate('/result/electronics')} className="px-4 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300">Top Electronics</button>
                 <button onClick={() => navigate('/result/fashion')} className="px-4 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300">Fashion Deals</button>
                 <button onClick={() => navigate('/result/grocery')} className="px-4 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300">Grocery Savings</button>
              </div>
            </div>

            <div className="relative flex items-center justify-center w-full max-w-md mt-12 md:w-1/2 md:mt-0 md:pl-8 lg:pl-16">
              <div
                className={`relative w-full transition-transform duration-300 ease-in-out ${isCardHovered ? 'scale-105' : 'scale-100'}`}
                onMouseEnter={() => setIsCardHovered(true)}
                onMouseLeave={() => setIsCardHovered(false)}
              >
                 <div className="w-full min-h-[520px] flex items-center justify-center bg-emerald-500 rounded-[32px] shadow-xl p-6 overflow-hidden">
                   {isFeaturedLoading ? (
                     <div className="flex flex-col items-center text-center text-white animate-pulse">
                         <div className="w-full h-56 mb-6 bg-black rounded-xl opacity-50"></div>
                         <div className="w-3/4 h-5 mb-3 bg-white rounded opacity-30"></div>
                         <div className="w-1/2 h-6 mb-8 bg-white rounded opacity-30"></div>
                         <div className="w-full h-24 bg-white rounded-lg opacity-20"></div>
                         <div className="w-3/4 h-10 mt-8 bg-white rounded-full opacity-30"></div>
                     </div>
                   ) : featuredError ? (
                     <div className="flex flex-col items-center text-center text-white">
                       <AlertTriangle className="w-12 h-12 text-yellow-300" />
                       <p className="mt-3 text-sm font-semibold text-yellow-100">Oops! Error Loading Deal</p>
                       <p className="mt-1 text-xs text-white/80 max-w-xs">{featuredError}</p>
                     </div>
                   ) : featuredProduct ? (
                     <div className="relative flex flex-col items-center w-full">
                       <button aria-label="View external link (placeholder)" className="absolute z-10 p-2 transition-colors duration-200 bg-white rounded-full shadow top-4 right-4 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-300">
                           <ExternalLink className="w-4 h-4 text-emerald-700" />
                       </button>
                       <div className="relative flex items-center justify-center w-full mb-6 bg-black rounded-xl h-56">
                         <div className="p-4">
                           <img
                             src={featuredData.image}
                             alt={featuredData.title}
                             className="object-contain h-44 max-w-full"
                             onError={(e) => { e.target.onerror = null; e.target.src='/placeholder-image.svg'; }}
                           />
                         </div>
                       </div>
                       <div className="text-center">
                         <h3 className="text-xl font-bold text-white line-clamp-2" title={featuredData.title}>{featuredData.title}</h3>
                         <div className="flex items-baseline justify-center flex-wrap mt-2 space-x-2 min-h-[32px]">
                            {featuredData.originalPriceSlashed && (
                                <span className="inline-flex items-baseline">
                                    <span className="text-base text-white line-through text-opacity-70">
                                        {formatPrice(featuredData.originalPriceSlashed)}
                                    </span>
                                    {featuredData.discountPercent && (
                                        <span className="ml-1.5 inline-block bg-yellow-300 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                            {featuredData.discountPercent} OFF
                                        </span>
                                    )}
                                </span>
                            )}
                            <span className="text-2xl font-bold text-white">
                                {formatPrice(featuredData.currentPrice)}
                            </span>
                         </div>
                       </div>
                       <div className="w-full mt-6">
                         <div className="mb-2 text-sm font-medium text-white text-opacity-90">Available at:</div>
                         {/* Added scrollbar-thin and padding adjustment to hide scrollbar visually */}
                         <div className="space-y-2 max-h-28 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-transparent scrollbar-thumb-rounded-full">
                           {featuredData.stores.length > 0 ? featuredData.stores.map((store, index) => (
                             <div key={`${store}-${index}`} className="flex items-center justify-between p-3 transition-colors duration-200 bg-white rounded-lg cursor-pointer bg-opacity-10 hover:bg-opacity-20">
                               <span className="text-sm text-white truncate">{store}</span>
                               <ChevronRight className="w-4 h-4 text-white text-opacity-70 flex-shrink-0 ml-2" />
                             </div>
                           )) : (
                                <p className="text-sm text-center text-white text-opacity-70">No online stores listed.</p>
                           )}
                         </div>
                       </div>
                       <button
                          onClick={() => handleNavigateToComparison(featuredData.productId)}
                          disabled={!featuredData.productId}
                          className="mt-8 px-8 py-3 text-base font-semibold transition-colors duration-200 bg-white rounded-full shadow-lg text-emerald-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                         Compare Prices
                       </button>
                     </div>
                   ) : (
                        <div className="text-center text-white text-opacity-70">No featured product to display.</div>
                   )}
                 </div>
              </div>
            </div>
        </div>
      </div>

      {/* Section 2: Recent Searches Table */}
      <div className="px-4 py-12 mx-auto bg-gray-50 max-w-7xl sm:px-6 lg:px-8 md:py-16">
         <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 md:text-3xl">Recently Viewed Products</h2>
         {recentSearchLogs.length > 0 ? (
             <div className="overflow-x-auto bg-white rounded-lg shadow">
                 <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                         <tr>
                             <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6">Product</th>
                             <th scope="col" className="hidden px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:table-cell sm:px-6">Category</th>
                             <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:px-6">Viewed On</th>
                             <th scope="col" className="relative px-4 py-3 sm:px-6"><span className="sr-only">View</span></th>
                         </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                         {recentSearchLogs.slice(0, 8).map((log) => (
                             <tr key={log.logId} className="transition-colors hover:bg-gray-50">
                                 <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                                     <div className="flex items-center">
                                         <div className="flex-shrink-0 w-10 h-10">
                                             <img className="object-contain w-full h-full rounded" src={log.product?.image || '/placeholder-image.svg'} alt={log.product?.title || 'Product'} onError={(e) => { e.target.onerror = null; e.target.src='/placeholder-image.svg'; }}/>
                                         </div>
                                         <div className="ml-4">
                                             <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={log.product?.title}>
                                                 {log.product?.title || 'Unknown Product'}
                                             </div>
                                         </div>
                                     </div>
                                 </td>
                                 <td className="hidden px-4 py-4 text-sm text-gray-500 whitespace-nowrap sm:table-cell sm:px-6">{log.product?.category || 'N/A'}</td>
                                 <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap sm:px-6">{formatDate(log.timestamp)}</td>
                                 <td className="px-4 py-4 text-sm font-medium text-right whitespace-nowrap sm:px-6">
                                     <button
                                        onClick={() => handleNavigateToComparison(log.product?.id)}
                                        disabled={!log.product?.id}
                                        className="inline-flex items-center px-3 py-1 text-xs font-semibold text-emerald-700 transition-colors duration-150 bg-emerald-100 rounded-full hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        View <ChevronRight className="w-3 h-3 ml-1 -mr-0.5"/>
                                    </button>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
         ) : (
             <p className="text-center text-gray-500">No recent searches to display.</p>
         )}
      </div>

      {/* Section 3: Why Choose Us */}
      <div className="px-4 py-12 text-center bg-emerald-100 md:py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-emerald-800 md:text-3xl">Why Choose BargainBuddy?</h2>
          <p className="max-w-3xl mx-auto mt-4 text-base text-emerald-700 md:text-lg">
              BargainBuddy helps you save money by comparing prices across multiple retailers instantly. Our users love how simple and powerful it is!
          </p>
          <p className="max-w-3xl mx-auto mt-2 text-base text-emerald-700 md:text-lg">
              Join thousands of happy shoppers who have already found better deals with BargainBuddy.
          </p>
      </div>

      {/* Section 4: Feature Cards */}
      <div className="px-4 py-12 mx-auto bg-gray-100 max-w-7xl sm:px-6 lg:px-8 md:py-16">
         <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
             <div className="p-6 text-center transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
                 <div className="inline-flex items-center justify-center w-12 h-12 mb-4 text-white bg-emerald-500 rounded-full"><ShoppingBag className="w-6 h-6" /></div>
                 <h3 className="mb-2 text-lg font-semibold text-gray-800">Style meets saving</h3>
                 <p className="text-sm text-gray-600">Discover the latest fashion trends and home goods at unbeatable prices.</p>
             </div>
             <div className="p-6 text-center transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
                 <div className="inline-flex items-center justify-center w-12 h-12 mb-4 text-white bg-emerald-500 rounded-full"><Volume2 className="w-6 h-6" /></div>
                 <h3 className="mb-2 text-lg font-semibold text-gray-800">Sound of the sale</h3>
                 <p className="text-sm text-gray-600">Get notified about price drops on electronics, headphones, and audio gear.</p>
             </div>
             <div className="p-6 text-center transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
                 <div className="inline-flex items-center justify-center w-12 h-12 mb-4 text-white bg-emerald-500 rounded-full"><Zap className="w-6 h-6" /></div>
                 <h3 className="mb-2 text-lg font-semibold text-gray-800">Deals on demand</h3>
                 <p className="text-sm text-gray-600">Instantly compare prices across multiple stores for any product you search.</p>
             </div>
             <div className="p-6 text-center transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
                 <div className="inline-flex items-center justify-center w-12 h-12 mb-4 text-white bg-emerald-500 rounded-full"><CheckCircle className="w-6 h-6" /></div>
                 <h3 className="mb-2 text-lg font-semibold text-gray-800">Savings simplified</h3>
                 <p className="text-sm text-gray-600">Track prices, set alerts, and make informed decisions easily. All for free!</p>
             </div>
         </div>
      </div>

    </div>
  );
};

export default HeroSection;
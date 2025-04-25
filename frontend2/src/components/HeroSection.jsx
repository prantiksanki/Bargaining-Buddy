import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [recentProduct, setRecentProduct] = useState(null); // State to hold recent product
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentProduct = async () => {
      setIsLoading(true); // Set loading to true when fetching starts
      try {
        const res = await fetch('http://localhost:5000/products/recent-searches');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Recent product data:", data);

        if (data && data.length > 0) {
          // Assuming the API returns an array of recent searches, take the first one
          setSelectedProduct(data[0].product);
        } else {
          console.warn("No recent products found.");
          setSelectedProduct(null); // Or set a default product
        }
      } catch (err) {
        console.error('Error fetching recent product:', err);
        setSelectedProduct(null); // Handle error by setting a default or null
      } finally {
        setIsLoading(false); // Set loading to false when fetching ends
      }
    };

    fetchRecentProduct();
  }, []);

  useEffect(() => {
    const fetchRecentProductDetails = async () => {
      if (!selectedProduct?.id) {
        console.log("No selected product ID, skipping fetchRecentProductDetails");
        return;
      }
      setIsLoading(true); // Set loading to true when fetching starts

      try {
        const res = await fetch(`http://localhost:5000/product/${selectedProduct.id}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Recent product details:", data);
        setRecentProduct(data);
      } catch (err) {
        console.error('Error fetching recent product details:', err);
        setRecentProduct(null);
      } finally {
        setIsLoading(false); // Set loading to false when fetching ends
      }
    };

    fetchRecentProductDetails();

  }, [selectedProduct]);


  console.log("Selected product:", recentProduct);

  useEffect(() => {
    if (query.trim() === '') {
      setFiltered([]);
    } else {
      const matches = products.filter((product) =>
        (product?.title || product?.name || '').toLowerCase().includes(query.toLowerCase())
      );
      setFiltered(matches);
    }
  }, [query, products]);

  const handleComparePrices = () => {
    if (selectedProduct) {
      navigate(`/comparison?search=${encodeURIComponent(selectedProduct.id)}`);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-100">
      <div className="flex flex-col items-center px-4 py-12 mx-auto md:flex-row max-w-7xl sm:px-6 lg:px-8">
        {/* Left Content */}
        <div className="w-full md:w-1/2 md:pr-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Stop overpaying.
            <br />
            Start saving.
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Real time price tracking, across Amazon, Flipkart, 1mg, and more.
          </p>

          {/* Search Bar */}
          <div className="relative flex items-center mt-8">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full py-3 pl-10 pr-4 text-gray-900 transition-all duration-300 bg-white border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <button className="px-6 py-3 ml-2 font-medium text-white transition-all duration-300 rounded-full shadow bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
             onClick={() => {
              if (query.trim()) {
                navigate(`/result/${query}`);
              }
            }}>
              Search
            </button>
          </div>

          {/* Dropdown for filtered search results */}
          {filtered.length > 0 && (
            <div className="absolute z-10 w-full mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60 md:max-w-xl">
              <ul className="py-1">
                {filtered.map((item, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 text-gray-700 transition-colors duration-200 cursor-pointer hover:bg-emerald-50"
                    onClick={() => {
                      setQuery(item.title || item.name);
                      setFiltered([]);
                      navigate(`/comparison?search=${encodeURIComponent(item.title || item.name)}`);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{item.title || item.name}</span>
                      <span className="font-medium text-emerald-600">22% off</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Feature Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <button className="flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition-colors duration-300 rounded-lg bg-emerald-500 hover:bg-emerald-600">
              <span className="mr-2">○</span>
              Electronics
            </button>
            <button className="flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 transition-colors duration-300 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400">
              <span className="mr-2">♡</span>
              Fashion Deals
            </button>
            <button className="flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 transition-colors duration-300 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400">
              <span className="mr-2">⊕</span>
              Grocery Deals
            </button>
          </div>
        </div>

        {/* Right Content - Product Showcase */}
        <div className="relative flex items-center justify-center w-full mt-10 md:w-1/2 md:mt-0">
          <div
            className={`relative w-80 md:w-96 transition-all duration-500 ${isCardHovered ? 'scale-105' : 'scale-100'}`}
            onMouseEnter={() => setIsCardHovered(true)}
            onMouseLeave={() => setIsCardHovered(false)}
          >
            {isLoading ? (
              <div>Loading recent product...</div>
            ) : recentProduct ? (
              <div className="relative overflow-hidden rounded-3xl" style={{ backgroundColor: '#34D399' }}>
                {/* Product Image */}
                <div className="relative flex items-center justify-center w-full h-40">
                  <img
                    src={recentProduct.image}
                    alt={recentProduct.title}
                    className="max-w-full max-h-40"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.svg";
                    }}
                  />
                  <a href={recentProduct.xerveLink} target="_blank" rel="noopener noreferrer" className="absolute p-2 bg-white rounded-full top-2 right-2 hover:bg-gray-100">
                    <ExternalLink className="w-4 h-4 text-emerald-600" />
                  </a>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white">{recentProduct.title}</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-white line-through opacity-80">Rs. {recentProduct.prices[0].mrp}</span>
                    <span className="ml-2 text-2xl font-bold text-white">Rs. {recentProduct.prices[0].price}</span>
                  </div>
                </div>

                {/* Available at Stores */}
                <div className="p-4">
                  <p className="text-sm font-medium text-white">Available at:</p>
                  <div className="mt-2 space-y-2">
                    {recentProduct.prices.map((store, index) => (
                      <a key={index} href={store.url} target="_blank" rel="noopener noreferrer">
                        <div className="flex items-center justify-between p-2 bg-white rounded-lg bg-opacity-10 hover:bg-opacity-20">
                          <span className="text-white">{store.retailer}</span>
                          <ChevronRight className="w-4 h-4 text-white" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Compare Button */}
                <div className="p-4">
                  <button
                    className="w-full py-3 font-medium transition-all duration-300 bg-white rounded-full shadow-lg text-emerald-600 hover:bg-gray-50"
                    onClick={handleComparePrices}
                  >
                    Compare Prices
                  </button>
                </div>
              </div>
            ) : (
              <div>No recent product found.</div> // Display message when no product is available
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
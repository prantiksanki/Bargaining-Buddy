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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentProduct = async () => {
      try {
        const res = await fetch('http://localhost:5000/products/recent-searches');
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
      }
    };

    fetchRecentProduct();
  }, []);

  useEffect(() => {
    const fetchRecentProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/product/${selectedProduct.id}`);
        const data = await res.json();
        console.log("Recent product data:", data);

        if (data && data.length > 0) {
          // Assuming the API returns an array of recent searches, take the first one
          console.log(data)
          setRecentProduct(data[0].product);
        } else {
          console.warn("No recent products found.");
          setSelectedProduct(null); // Or set a default product
        }
      } catch (err) {
        console.error('Error fetching recent product:', err);
        setSelectedProduct(null); // Handle error by setting a default or null
      }
    };

    fetchRecentProduct();
  }, []);



  

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

  const mockProduct = {
    id: "123",
    title: "Apple AirPods Pro",
    image: "url_to_image",
    originalPrice: 249.99,
    discountPrice: 194.99,
    stores: ["Amazon", "Best Buy", "Apple Store"],
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
            <button className="flex items-center justify-center px-6 py-3 text-sm font-medium text-white transition-colors duration-300 rounded-lg bg-emerald-500 hover:bg-emerald-600"
            onClick={() => navigate('/result/electronics')}
            >
              <span className="mr-2">○</span>
              Electronics
            </button>
            <button className="flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 transition-colors duration-300 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400"
            onClick={() => navigate('/result/fashion')}
            >
              <span className="mr-2">♡</span>
              Fashion Deals
            </button>
            <button className="flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 transition-colors duration-300 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400"
            onClick={() => navigate('/result/grocery')}
            >
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
            {selectedProduct ? (
              <div className="relative p-6 overflow-hidden shadow-xl bg-emerald-500 rounded-3xl">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute w-40 h-40 bg-white rounded-full -right-8 -top-8"></div>
                  <div className="absolute w-40 h-40 bg-white rounded-full -left-8 -bottom-8"></div>
                </div>
                
                <button className="absolute z-10 p-2 transition-colors duration-300 bg-white rounded-full shadow-md top-4 right-4 hover:bg-gray-100">
                  <ExternalLink className="w-4 h-4 text-emerald-600" />
                </button>

                <div className="relative flex flex-col items-center">
                  {/* Product Image */}
                  <div className="relative flex items-center justify-center w-full h-40 mb-4">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      className={`h-40 object-contain transition-all duration-500 ${isCardHovered ? 'scale-110' : 'scale-100'}`}
                      onError={(e) => {
                        e.target.onerror = null; // prevent infinite loop
                        e.target.src="/placeholder-image.svg"
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-bold text-white">{selectedProduct.title}</h3>
                    {/* <div className="flex items-center justify-center mt-2 space-x-3">
                      <span className="text-white line-through text-opacity-80">${selectedProduct.price}</span>
                      <span className="text-2xl font-bold text-white">${selectedProduct.discountPrice}</span>
                    </div> */}
                  </div>

                  {/* Discount Badge */}
                  {/* <div className={`absolute p-2 bg-gray-900 rounded-full -top-3 -right-3 transform transition-all duration-300 ${isCardHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}>
                    <span className="px-1 text-sm font-bold text-white">{selectedProduct.discountPercent}%</span>
                  </div> */}

                  {/* Stores Available */}
                  {/* <div className="w-full mt-6">
                    <div className="mb-2 text-sm font-medium text-white">Available at:</div>
                    <div className="space-y-2">
                      {selectedProduct.stores && selectedProduct.stores.map((store, index) => (
                        <div key={index} className="flex items-center justify-between p-2 transition-colors duration-300 bg-white rounded-lg bg-opacity-10 hover:bg-opacity-20">
                          <span className="text-white">{store}</span>
                          <ChevronRight className="w-4 h-4 text-white" />
                        </div>
                      ))}
                    </div>
                  </div> */}

                  {/* Compare Button */}
                  <button 
                    className={`mt-6 px-6 py-3 bg-white rounded-full text-emerald-600 font-medium shadow-lg hover:bg-gray-50 transition-all duration-300 ${isCardHovered ? 'scale-105' : 'scale-100'}`}
                    onClick={handleComparePrices}
                  >
                    Compare Prices
                  </button>
                </div>
              </div>
            ) : (
              <div>Loading recent product...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
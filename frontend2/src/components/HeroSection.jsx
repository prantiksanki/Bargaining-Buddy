import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/product/recent-searches');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('API fetch error:', err);
      }
    };
    fetchProducts();
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

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="absolute inset-0">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          preserveAspectRatio="xMidYMid slice"
        >
          <g fill="none" fillRule="evenodd">
            <circle cx="512" cy="512" r="512" fill="#F9FAFB" />
            <circle cx="512" cy="512" r="400" fill="#F3F4F6" />
            <circle cx="512" cy="512" r="300" fill="#EFF6FF" />
          </g>
        </svg>
      </div>
      
      <div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Find the <span className="text-blue-600">Best Deals</span> Across the Web
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Compare prices from multiple retailers and save money on your purchases.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mt-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full py-3 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Dropdown for filtered search results */}
            {filtered.length > 0 && (
              <div className="absolute z-10 w-full mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60">
                <ul className="py-1">
                  {filtered.map((item, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-blue-50"
                      onClick={() => {
                        setQuery(item.title || item.name);
                        setFiltered([]);
                        navigate(`/comparison?search=${encodeURIComponent(item.title || item.name)}`);
                      }}
                    >
                      {item.title || item.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            className="w-full px-6 py-3 mt-4 font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              if (query.trim()) {
                navigate(`/result/${query}`);
              }
            }}
          >
            Search
          </button>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty'].map((cat) => (
            <button
              key={cat}
              className="px-6 py-2 text-sm font-medium text-blue-700 transition-colors bg-blue-100 rounded-full hover:bg-blue-200"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
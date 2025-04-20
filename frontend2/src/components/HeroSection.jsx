import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('API fetch error:', err);
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on input query
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

  // const handleProductClick = (name) => {
  //   setQuery(name);
  //   setFiltered([]);
  //   navigate(`/comparison?search=${encodeURIComponent(name)}`);
  // };

  return (
    <section className="flex flex-col items-center justify-center text-center px-4 py-16 bg-[#1f2937] text-white min-h-[70vh]">
      <h1 className="mb-4 text-5xl font-bold md:text-6xl">
        Find the Best Deals Across the Web
      </h1>
      <p className="mb-8 text-lg text-gray-300 md:text-xl">
        Compare prices from multiple retailers and save money on your purchases.
      </p>

      {/* Search Bar */}
      <div className="relative flex items-start w-full max-w-2xl gap-2">
        <div className="relative flex-grow">
          <span className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search for products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#0f172a] text-white placeholder-gray-400 rounded-md py-2 pl-10 pr-4 focus:outline-none"
          />

          {/* Dropdown */}
          {/* {filtered.length > 0 && (
            <ul className="absolute z-50 bg-[#0f172a] text-white w-full mt-2 rounded-md shadow-lg max-h-60 overflow-y-auto border border-gray-700">
              {filtered.map((item, index) => (
                <li
                  key={item.id || index}
                  className={`px-4 py-2 cursor-pointer transition-colors ${
                    index % 2 === 0
                      ? 'bg-[#0f172a] hover:bg-[#1f2937]'
                      : 'bg-[#1a2332] hover:bg-[#2a3444]'
                  }`}
                  onClick={() => handleProductClick(item.title || item.name)}
                >
                  {item.title || item.name}
                </li>
              ))}
            </ul>
          )} */}
        </div>

        <button
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
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
            className="px-4 py-2 font-semibold text-white transition bg-black rounded-md hover:bg-gray-800"
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;

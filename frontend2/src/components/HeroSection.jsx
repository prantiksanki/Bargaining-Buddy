import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products');
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
        product.title.toLowerCase().includes(query.toLowerCase())
      );
      setFiltered(matches);
    }
  }, [query, products]);

  return (
    <section className="flex flex-col items-center justify-center text-center px-4 py-16 bg-[#1f2937] text-white min-h-[70vh]">
      <h1 className="text-5xl md:text-6xl font-bold mb-4">
        Find the Best Deals Across the Web
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-8">
        Compare prices from multiple retailers and save money on your purchases.
      </p>

      {/* Search Bar */}
      <div className="relative flex items-start gap-2 w-full max-w-2xl">
        <div className="relative flex-grow">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
          {filtered.length > 0 && (
            <ul className="absolute z-10 bg-[#0f172a] text-white w-full mt-2 rounded-md shadow-lg max-h-60 overflow-y-auto border border-gray-700">
              {filtered.map((item, index) => (
                <li
                  key={item.id}
                  className={`px-4 py-2 cursor-pointer transition-colors ${
                    index % 2 === 0
                      ? 'bg-[#0f172a] hover:bg-[#1f2937]'
                      : 'bg-[#1a2332] hover:bg-[#2a3444]'
                  }`}
                  onClick={() => {
                    setQuery(item.title);
                    setFiltered([]);
                  }}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
          Search
        </button>
      </div>

      {/* Category Buttons */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        {['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty'].map((cat) => (
          <button
            key={cat}
            className="bg-black text-white font-semibold px-4 py-2 rounded-md hover:bg-gray-800 transition"
          >
            {cat}
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;

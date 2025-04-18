import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RecentSearches = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="bg-[#1f2937] text-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-1 text-3xl font-semibold">Recent Searches</h2>
        <p className="mb-8 text-gray-400">Products you’ve recently viewed</p>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#111827] rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                alt={product.name || 'Product'}
                className="object-cover w-full h-64"
              />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold truncate">
                    {product.name || product.title || 'Unnamed Product'}
                  </h3>
                  <span className="px-2 py-1 text-xs text-white bg-gray-700 rounded-full">
                    {product.category || 'Uncategorized'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-300">
                  {product.description || 'No description available.'}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-semibold">Rs. {product.lowestPrice || 'N/A'}</span>
                  <button
                    className="px-3 py-1 text-sm text-white transition bg-gray-800 border border-gray-600 rounded hover:bg-gray-700"
                    onClick={() => {
                      const name = product.name || product.title;
                      if (name?.trim()) {
                        navigate(`/comparison?search=${encodeURIComponent(name.toLowerCase())}`);
                      }
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentSearches;

import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ProductPage = ({ searchQuery }) => {
  const location = useLocation();
  const query = searchQuery || new URLSearchParams(location.search).get('search');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/products?search=${query}`);
        const data = await res.json();
        setProducts(data); // now handles an array of products
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };

    if (query) {
      fetchProducts();
    }
  }, [query]);

  if (!products.length) {
    return (
      <div className="min-h-screen p-8 text-white bg-gray-900">
        <h1 className="p-4 text-sm text-gray-300">No matching items found.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 space-y-12 text-white bg-gray-900">
      {products.map((product, index) => (
        <div
          key={product.id}
          className={`max-w-7xl mx-auto rounded-xl p-6 shadow-md ${
            index % 2 === 0 ? 'bg-[#0f172a]' : 'bg-[#1a2332]'
          }`}
        >
          <h1 className="mb-1 text-3xl font-bold">{product.name}</h1>
          <p className="mb-6 text-gray-400">{product.category}</p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Product Image and Price */}
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="mb-4 rounded-lg"
              />
              <p className="text-xl font-semibold">
                Rs. {product.lowestPrice} - Rs. {product.highestPrice}
              </p>
              <button className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700">
                Set Price Alert
              </button>
            </div>

            {/* Price Comparison Table */}
            <div>
              <div className="flex items-center justify-between px-4 py-2 text-sm font-semibold bg-gray-700 rounded-t-lg">
                <p>Price Comparison</p>
                <p>Price</p>
              </div>
              <div className="bg-gray-800 divide-y divide-gray-700 rounded-b-lg">
                {product.prices.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{item.retailer}</p>
                      <p
                        className={`text-sm ${
                          item.inStock ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-green-400">
                        Rs. {item.price.toFixed(2)}
                      </p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-5 h-5 text-blue-400 hover:text-blue-500" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-10">
            <h2 className="mb-2 text-xl font-semibold">Description</h2>
            <p className="text-gray-400">{product.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductPage;


import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ProductPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('search');
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

    fetchProducts();
  }, [query]);

  if (!products.length) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="p-4 text-gray-300 text-sm">No matching items found.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 space-y-12">
      {products.map((product, index) => (
        <div
          key={product.id}
          className={`max-w-7xl mx-auto rounded-xl p-6 shadow-md ${
            index % 2 === 0 ? 'bg-[#0f172a]' : 'bg-[#1a2332]'
          }`}
        >
          <h1 className="text-3xl font-bold mb-1">{product.name}</h1>
          <p className="text-gray-400 mb-6">{product.category}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image and Price */}
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="rounded-lg mb-4"
              />
              <p className="text-xl font-semibold">
                Rs. {product.lowestPrice} - Rs. {product.highestPrice}
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
                Set Price Alert
              </button>
            </div>

            {/* Price Comparison Table */}
            <div>
              <div className="flex justify-between items-center bg-gray-700 text-sm font-semibold px-4 py-2 rounded-t-lg">
                <p>Price Comparison</p>
                <p>Price</p>
              </div>
              <div className="bg-gray-800 rounded-b-lg divide-y divide-gray-700">
                {product.prices.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center px-4 py-3"
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
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-400">{product.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductPage;


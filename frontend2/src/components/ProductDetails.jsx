import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, ChevronRight, Plus, Heart } from 'lucide-react';
import loadingAnimation from '../assets/Loading.json'; // Renamed to avoid conflict
import { Player } from '@lottiefiles/react-lottie-player';

const ProductPage = ({ searchQuery }) => {
  const location = useLocation();
  const query = searchQuery || new URLSearchParams(location.search).get('search');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Renamed for clarity
  const [error, setError] = useState(null); // Added for error handling

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) return; // Early return if no query

      try {
        setIsLoading(true);
        setError(null); // Reset error state
        const res = await fetch(`http://localhost:5000/scrape?id=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Player
          autoplay
          loop
          src={loadingAnimation}
          style={{ height: '300px', width: '300px' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-500">No products found for "{query}".</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {products.map((product, index) => (
        <div key={product.id || index} className="container px-4 py-8 mx-auto">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Column - Product Image and Details */}
            <div className="bg-[#f0f7f4] rounded-3xl p-8">
              <div className="relative mb-8">
                <img
                  src={product.image?.replace('100x100', '1100x1000') || '/placeholder.jpg'}
                  alt={product.name || 'Product image'}
                  className="object-contain w-full rounded-2xl"
                  style={{ height: '400px' }}
                  onError={(e) => (e.target.src = '/placeholder.jpg')} // Fallback for broken images
                />
                <button className="absolute p-2 transition-shadow bg-white rounded-full shadow-sm top-4 right-4 hover:shadow-md">
                  <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                </button>
              </div>

              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                {product.name || 'Unnamed Product'}
              </h1>

              <button className="w-full py-3 font-medium text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600">
                Set Price Alert →
              </button>
            </div>

            {/* Right Column - Price Comparison */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Price Matrix</h2>
                <button className="p-2 transition-colors rounded-full hover:bg-gray-100">
                  <Search className="w-6 h-6" />
                </button>
              </div>

              {product.prices && product.prices.length > 0 ? (
                <>
                  {/* Highlighted Minimum Price Card */}
                  <div className="bg-[#e8f5f0] rounded-2xl p-6 mb-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="mb-2 text-2xl font-semibold text-green-700">
                          Rs. {product.prices[0].price}
                        </h3>
                        <p className="text-green-600">
                          In Stock at {product.prices[0].retailer}
                        </p>
                      </div>
                      <button
                        className="p-2 text-white transition-colors duration-200 bg-blue-500 rounded-full hover:bg-blue-600"
                        onClick={() => window.open(product.prices[0].url, '_blank')}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Price Comparison List */}
                  {product.prices.map((item) => (
                    <div
                      key={item.url || item.retailer} // Use unique identifier
                      className="p-6 transition-colors bg-gray-100 shadow-sm rounded-2xl hover:bg-gray-50 group hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="mb-1 font-medium">{item.retailer}</h3>
                          <p className="text-gray-500">
                            Discount: {item.discount && item.discount !== '0%' ? item.discount : '0%'}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-blue-500">
                            Rs. {item.price}
                          </span>
                          <ChevronRight
                            className="w-5 h-5 text-gray-400 cursor-pointer group-hover:text-gray-600"
                            onClick={() => window.open(item.url, '_blank')}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="bg-[#e8f5f0] rounded-2xl p-6 mb-6">
                  <p>No price information available.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductPage;
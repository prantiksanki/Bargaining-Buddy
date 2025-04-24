import React, { useEffect, useState } from 'react';
import { ExternalLink, AlertTriangle, ArrowDown, TrendingDown, Tag, ShoppingBag, Check, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ProductPage = ({ searchQuery }) => {
  const location = useLocation();
  const query = searchQuery || new URLSearchParams(location.search).get('search');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log(query);
        const res = await fetch(`http://localhost:5000/scrape?id=${query}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchProducts();
    }
  }, [query]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center text-blue-600 animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
          <p className="mt-4 font-medium text-gray-700">Loading product data...</p>
        </div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8 bg-gray-50">
        <div className="p-8 text-center bg-white rounded-lg shadow-md">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-amber-500" />
          <h1 className="text-2xl font-bold text-gray-800">No Products Found</h1>
          <p className="mt-2 text-gray-600">We couldn't find any products matching your query.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      {products.map((product, index) => (
        <div key={index} className="px-4 mx-auto mb-12 max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm rounded-xl">
            {/* Product Header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex flex-wrap items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{product.name}</h1>
                  <div className="flex items-center mt-1">
                    <Tag className="w-4 h-4 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-500">{product.category}</span>
                    {product.size && (
                      <>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-sm text-gray-500">Size: {product.size}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-4 sm:mt-0">
                  <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Set Price Alert
                    <TrendingDown className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 gap-y-8 gap-x-12 lg:grid-cols-2">
                {/* Product Image and Price Range */}
                <div>
                  <div className="p-2 mb-6 bg-gray-100 rounded-lg">
                    <img
                      src={product.image?.replace("100x100", "1100x1000") || '/api/placeholder/400/320'}
                      alt={product.name}
                      className="object-contain mx-auto rounded-lg"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                  
                  <div className="p-5 rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Price Overview</h3>
                      <ArrowDown className="w-4 h-4 text-green-600" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Lowest Price</p>
                        <p className="text-xl font-bold text-green-600">₹ {product.lowestPrice}</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Highest Price</p>
                        <p className="text-xl font-bold text-red-500">₹ {product.highestPrice}</p>
                      </div>
                    </div>
                    
                    <div className="p-3 mb-4 bg-white rounded-lg shadow-sm">
                      <p className="text-sm text-gray-500">Average Price</p>
                      <p className="text-xl font-bold text-blue-600">₹ {product.averagePrice}</p>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <ShoppingBag className="w-4 h-4 mr-1" />
                      <span>Prices updated every 4 hours</span>
                    </div>
                  </div>
                </div>

                {/* Price Comparison Table */}
                <div>
                  <h3 className="mb-4 text-xl font-semibold text-gray-900">Price Comparison</h3>
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Retailer</span>
                        <span className="font-medium text-gray-700">Best Price</span>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                      {product.prices.map((item, i) => (
                        <div key={i} className="px-6 py-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{item.retailer}</p>
                              <div className="mt-1">
                                <p className="text-sm text-gray-500">
                                  MRP: {item.mrp === "Not found" ? "N/A" : "₹ " + item.mrp} 
                                  {item.discount && item.discount !== "0%" && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                      {item.discount} OFF
                                    </span>
                                  )}
                                </p>
                                <p className="flex items-center mt-1 text-sm">
                                  {item.inStock ? (
                                    <>
                                      <Check className="w-4 h-4 mr-1 text-green-500" />
                                      <span className="text-green-600">In Stock</span>
                                    </>
                                  ) : (
                                    <>
                                      <X className="w-4 h-4 mr-1 text-red-500" />
                                      <span className="text-red-600">Out of Stock</span>
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center">
                              <div className="mr-4 text-right">
                                <p className="text-lg font-bold text-blue-600">
                                  ₹ {item.price.toFixed(2)}
                                </p>
                              </div>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Visit
                                <ExternalLink className="w-4 h-4 ml-1" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductPage;
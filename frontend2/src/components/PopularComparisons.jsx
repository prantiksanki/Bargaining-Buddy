import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, TrendingUp, ChevronRight } from 'lucide-react';

const PopularComparisons = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/popular');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching popular products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-1 mb-4 text-blue-600 rounded-full bg-blue-50">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Trending Now</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Popular Comparisons
          </h2>
          <p className="max-w-2xl mx-auto mt-3 text-xl text-gray-500">
            See what other shoppers are comparing right now
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid gap-6 mt-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <div 
              key={index} 
              className="overflow-hidden transition-shadow duration-200 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
            >
              <div className="h-48 overflow-hidden bg-gray-200">
                <img 
                  src={product.image || '/api/placeholder/400/320'} 
                  alt={product.name || product.title}
                  className="object-cover w-full h-full"
                />
              </div>
              
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {product.name || product.title || 'Unnamed Product'}
                  </h3>
                  <span className="ml-2 flex-shrink-0 bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-full flex items-center">
                    <Tag className="w-3 h-3 mr-1" />
                    {product.category || 'Uncategorized'}
                  </span>
                </div>
                
                <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                  {product.description || 'No description available.'}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-sm text-gray-500">Price from</p>
                    <p className="text-lg font-bold text-blue-600">
                      ₹{product.lowPrice || 'N/A'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const name = product.name || product.title;
                      if (name?.trim()) {
                        navigate(`/comparison?search=${encodeURIComponent(name.toLowerCase())}`);
                      }
                    }}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
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

export default PopularComparisons;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, Tag, ChevronRight, FilterX } from 'lucide-react';

export default function SearchResult() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { name } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log(name);
        const response = await fetch(`http://localhost:5000/search?q=${name}`);
        console.log(response);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [name]);

  const handleViewDetails = (productId) => {
    navigate(`/comparison?search=${encodeURIComponent(productId)}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center text-blue-600 animate-pulse">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
          <p className="mt-4 font-medium text-gray-700">Searching for products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <FilterX className="w-16 h-16 mb-4 text-red-500" />
        <div className="text-xl text-red-600">Error: {error}</div>
        <p className="mt-2 text-gray-600">Please try a different search or try again later.</p>
      </div>
    );
  }

  // Use actual products or sample data if no results
  const displayProducts = products.length > 0 ? products : [
    {
      id: 1,
      title: 'Apple iPhone 15 Pro',
      category: 'Electronics',
      description: 'The latest iPhone with innovative features and technologies',
      price: '129900',
      image: '/api/placeholder/400/320'
    },
    {
      id: 2,
      title: 'Sony WH-1000XM4 Wireless Headphones',
      category: 'Electronics',
      description: 'Industry-leading noise cancellation with Dual Noise Sensor technology',
      price: '19990',
      image: '/api/placeholder/400/320'
    },
    {
      id: 3,
      title: 'Lenovo ThinkPad X1 Carbon',
      category: 'Electronics',
      description: 'Ultra-lightweight business laptop with exceptional performance',
      price: '124990',
      image: '/api/placeholder/400/320'
    },
    {
      id: 4,
      title: 'Samsung Galaxy S24',
      category: 'Electronics',
      description: 'Next generation AI capabilities with impressive camera system',
      price: '79999',
      image: '/api/placeholder/400/320'
    }
  ];

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center mb-2">
              <Search className="w-5 h-5 mr-2 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Search Results for "{name}"
              </h1>
            </div>
            <p className="text-gray-600">
              Found {displayProducts.length} {displayProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          
          <div className="flex mt-4 space-x-2 md:mt-0">
            <select className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md">
              <option>Sort by: Relevance</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>
            
            <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md">
              Filter
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayProducts.map((product) => {
            // Skip blank images
            if (product.image && product.image.endsWith("rsz_blank_grey.jpg")) {
              return null;
            }
            
            return (
              <div key={product.id} className="overflow-hidden transition-shadow duration-200 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md">
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={product.image || '/api/placeholder/400/320'} 
                    alt={product.title} 
                    className="object-cover w-full h-full"
                  />
                </div>
                
                <div className="p-5">
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Tag className="w-3 h-3 mr-1" />
                      {product.category || 'Uncategorized'}
                    </span>
                  </div>
                  
                  <h3 className="mb-1 text-lg font-medium text-gray-900 line-clamp-2">
                    {product.title?.length > 40 ? product.title.slice(0, 40) + "..." : product.title}
                  </h3>
                  
                  <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                    {product.description || 'No description available.'}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-lg font-bold text-blue-600">₹ {product.price}</div>
                    <button
                      onClick={() => handleViewDetails(product.id)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Compare Prices
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <nav className="inline-flex rounded-md shadow">
            <a href="#" className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50">
              Previous
            </a>
            <a href="#" className="px-3 py-2 text-sm font-medium text-blue-600 bg-white border-t border-b border-gray-300 hover:bg-blue-50">
              1
            </a>
            <a href="#" className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border-t border-b border-gray-300 hover:bg-gray-50">
              2
            </a>
            <a href="#" className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border-t border-b border-gray-300 hover:bg-gray-50">
              3
            </a>
            <a href="#" className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 rounded-r-md">
              Next
            </a>
          </nav>
        </div>
      </div>
      {/*
       {isFilterOpen && (
           <FilterModal
               currentFilters={filters}
               onApplyFilters={applyFilters}
               onClose={() => setIsFilterOpen(false)}
           />
       )}
      */}
    </div>
  );
}
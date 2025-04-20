import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function SearchResult() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { name } = useParams()


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log(name)
        // Replace with your actual API endpoint
        const response = await fetch(`http://localhost:5000/products?name=${name}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewDetails = (productId) => {
    navigate(`/comparison?search=${encodeURIComponent(productId)}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  // For demo purposes, using sample data similar to the image
  const sampleProducts = [
    {
      id: 1,
      name: 'Apple iPhone 15 Pro',
      category: 'Electronics',
      description: 'Industry-leading noise cancellation with Dual Noise Sensor technology',
      price: 'Rs. 900',
      image: '/api/placeholder/400/320'
    },
    {
      id: 2,
      name: 'Sony WH-1000XM4 Wireless Headphones',
      category: 'Electronics',
      description: 'Industry-leading noise cancellation with Dual Noise Sensor technology',
      price: 'Rs. 900',
      image: '/api/placeholder/400/320'
    },
    {
      id: 3,
      name: 'Lenovo ThinkPad X1 Carbon',
      category: 'Electronics',
      description: 'Industry-leading noise cancellation with Dual Noise Sensor technology',
      price: 'Rs. 900',
      image: '/api/placeholder/400/320'
    },
    {
      id: 4,
      name: 'Samsung Galaxy S24',
      category: 'Electronics',
      description: 'Next generation AI capabilities with impressive camera system',
      price: 'Rs. 900',
      image: '/api/placeholder/400/320'
    },
    {
      id: 5,
      name: 'Bose QuietComfort Earbuds',
      category: 'Electronics',
      description: 'Premium noise cancellation in a compact form factor',
      price: 'Rs. 900',
      image: '/api/placeholder/400/320'
    },
    {
      id: 6,
      name: 'Dell XPS 13',
      category: 'Electronics',
      description: 'Ultra-portable laptop with InfinityEdge display',
      price: 'Rs. 900',
      image: '/api/placeholder/400/320'
    }
  ];

  const displayProducts = products.length > 0 ? products : sampleProducts;

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-900 md:px-8">
      <h1 className="mb-8 text-3xl font-bold text-white">Search Results</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {displayProducts.map((product) => (
          <div key={product.id} className="overflow-hidden bg-gray-800 rounded-lg shadow-lg">
            <div className="h-64 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6">
              <h2 className="mb-2 text-xl font-bold text-white">{product.name}</h2>
              <span className="inline-block px-3 py-1 mb-3 text-sm font-semibold text-gray-300 bg-gray-700 rounded-full">
                {product.category}
              </span>
              <p className="mb-4 text-gray-300">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-white">{product.price}</span>
                <button
                  onClick={() => handleViewDetails(product.id)}
                  className="px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
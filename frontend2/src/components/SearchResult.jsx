import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart, Search, Plus } from 'lucide-react';
import loadingAnimation from '../assets/Loading.json'; // Renamed to avoid conflict
import { Player } from '@lottiefiles/react-lottie-player';

export default function SearchResult() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { name } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/search?q=${name}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [name]);

  if (loading) {
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

  const displayProducts = products.length > 0 ? products : [
    {
      id: 1,
      title: 'OnePlus Nord Buds',
      description: 'elietbis borep conlcraeon',
      price: '93.8m',
      image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg'
    },
    {
      id: 2,
      title: 'Earials Budd Buddy',
      description: 'impacts',
      price: '12.9m',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'
    },
    {
      id: 3,
      title: 'OnePlus Nord Buelos',
      description: 'ltcirols',
      price: '22.0m',
      image: 'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg'
    }
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-12">
          <h1 className="text-5xl font-bold text-gray-900">Search Results</h1>
          <p className="text-gray-600">← For Cenods</p>
          
          {/* Search Bar */}
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-xl">
              <input
                type="text"
                placeholder="Ccnuls comments"
                className="w-full px-6 py-3 bg-white rounded-full shadow-sm pr-14"
              />
              <div className="absolute flex items-center gap-2 -translate-y-1/2 right-2 top-1/2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="relative p-6 transition-all duration-300 bg-white group rounded-3xl hover:shadow-lg"
            >
              {/* Favorite Button */}
              <button className="absolute z-10 p-2 right-4 top-4">
                <Heart className="w-5 h-5 text-gray-400 transition-colors duration-300 group-hover:text-red-500" />
              </button>

              {/* Product Image */}
              <div className="relative mb-4 overflow-hidden rounded-2xl aspect-square">
                <img
                  src={product.image}
                  alt={product.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="pr-8 text-lg font-semibold text-gray-900">{product.title}</h3>
                  <span className="text-gray-400">↗</span>
                </div>
                <p className="text-sm text-gray-500">{product.description}</p>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-500">+</span>
                    <span className="font-medium">{product.price}</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/comparison?search=${product.id}`)}
                    className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
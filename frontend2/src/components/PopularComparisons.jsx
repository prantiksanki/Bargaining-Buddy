import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import cloth from "../assets/Cloth.png";
import headphone from "../assets/Headphone.png";
import oil from "../assets/Oil.png";
import fridge from "../assets/fridge.png";

const PopularComparisons = () => {
  const [trendingItems] = useState([
    {
      id: 1,
      title: "Style Meets Savings",
      image: cloth,
      buttonText: "Shop Fashion",
      bgColor: "bg-emerald-500"
    },
    {
      id: 2,
      title: "Sound of the Sale",
      image: headphone,
      buttonText: "Explore Audio Deals",
      bgColor: "bg-gray-200"
    },
    {
      id: 3,
      title: "Daily Deal Drops",
      image: fridge,
      buttonText: "See What's New",
      bgColor: "bg-blue-300"
    },
    {
      id: 4,
      title: "Hidden Gems Uncovered",
      image: oil,
      buttonText: "Discover More",
      bgColor: "bg-gray-800"
    }
  ]);

  const navigate = useNavigate();

  return (
    <section className="px-4 py-12 mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {trendingItems.map((item) => (
          <div 
            key={item.id} 
            className={`
              ${item.bgColor} 
              rounded-2xl 
              p-6 
              relative 
              overflow-hidden 
              transition-all 
              duration-300 
              transform 
              hover:scale-[1.02] 
              hover:shadow-2xl 
              hover:-translate-y-1 
              cursor-pointer
              group
              ${item.id === 4 ? 'text-white' : 'text-gray-800'}
            `}
          >
            <div className="relative z-10">
              <div className="mb-6">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="object-contain w-full h-48 mb-4 transition-transform duration-300 transform rounded-lg group-hover:scale-105"
                />
                <h3 className="text-2xl font-semibold leading-tight tracking-tight">
                  {item.title}
                </h3>
              </div>

              <div className="flex items-end justify-between">
                <button 
                  className="px-4 py-2 text-sm font-medium text-gray-800 transition-all duration-300 bg-white rounded-full hover:bg-opacity-90 hover:shadow-md"
                  onClick={() => navigate(`/comparison?search=${encodeURIComponent(item.buttonText)}`)}
                >
                  {item.buttonText}
                </button>
                
                <button 
                  className="p-3 text-gray-800 transition-all duration-300 bg-white rounded-full hover:bg-opacity-90 hover:shadow-md group-hover:translate-x-1"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-white/5 to-black/5 group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularComparisons;
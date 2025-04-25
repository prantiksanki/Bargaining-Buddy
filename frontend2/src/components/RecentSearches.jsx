"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RecentSearches() {
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();

  // Static Reviews
  const reviews = [
    {
      author: "Michael K.",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      rating: 5,
      text: "BargainBuddy has completely changed how I shop online. I’ve saved so much money finding the best prices!",
    },
    {
      author: "Sophia L.",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      rating: 4,
      text: "I love how easy it is to compare products. BargainBuddy makes online shopping stress-free and efficient.",
    },
    {
      author: "David R.",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      rating: 5,
      text: "Excellent platform! I always check BargainBuddy before making any online purchase. Highly recommend!",
    },
  ];

  // Fetch recent searches from backend
  useEffect(() => {
    async function fetchRecentSearches() {
      try {
        const response = await axios.get("http://localhost:3000/api/search-logs/recent");
        setRecentSearches(response.data);
      } catch (error) {
        console.error("Error fetching recent searches:", error);
      }
    }
    fetchRecentSearches();
  }, []);

  // Navigate to product page
  const handleSearchClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Helper function to format date
  function formatDate(timestamp) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(timestamp).toLocaleDateString(undefined, options);
  }

  return (
    <section className="px-4 py-12 mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

        {/* Left Panel */}
        <div className="flex flex-col justify-center">
          <h1 className="mb-4 text-4xl font-extrabold leading-tight text-gray-900">
            Why Choose BargainBuddy?
          </h1>
          <p className="mb-6 text-lg text-gray-700">
            BargainBuddy helps you save money by comparing prices across multiple retailers instantly.
            Our users love how simple and powerful it is!
          </p>
          <p className="text-sm text-gray-500">
            Join thousands of happy shoppers who have already found better deals with BargainBuddy.
          </p>
        </div>

        {/* Right Panel */}
        <div>
          {/* User Reviews Section */}
            <h2 className="mb-8 text-3xl font-bold text-gray-800">User Reviews</h2>

          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="p-5 transition-all duration-300 transform bg-white border border-gray-100 cursor-pointer rounded-xl hover:shadow-xl hover:-translate-y-1 hover:border-indigo-50"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 overflow-hidden bg-gray-100 border-2 border-white rounded-full shadow-sm">
                    <img src={review.image} alt="User" className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="font-medium text-gray-800">{review.author}</p>
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">{review.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

export default RecentSearches;
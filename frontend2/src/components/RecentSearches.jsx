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

          {/* Divider */}
          {/* <hr className="my-8" /> */}

          {/* Recent Searches Table */}
         {/* <h2 className="mb-8 text-3xl font-bold text-gray-800">Recent Searches</h2>

          <div className="overflow-hidden rounded-lg shadow-sm bg-gray-50">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200"> */}
                {/* Table Head */}
                {/* <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"> */}
                      {/* Empty for image/title separation */}
                    {/* </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Viewed On
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead> */}

                {/* Table Body */}
                {/* <tbody className="bg-white divide-y divide-gray-200">
                  {recentSearches.map((entry) => (
                    <tr key={entry.logId} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        {entry.product.image ? (
                          <img src={entry.product.image} alt={entry.product.title} className="object-contain w-10 h-10 rounded" />
                        ) : (
                          <div className="flex items-center justify-center w-10 h-10 text-gray-400 bg-gray-200 rounded">?</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{entry.product.title}</div>
                        <div className="text-xs text-gray-500">{entry.product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(entry.timestamp)}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                        <button
                          onClick={() => handleSearchClick(entry.product.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div> */}

      </div>
    </section>
  );
}

export default RecentSearches;

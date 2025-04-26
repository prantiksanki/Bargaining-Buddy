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

  return (// empty div to avoid rendering issues
    <div className="recent-searches-container">
    </div>
  );
}

export default RecentSearches;
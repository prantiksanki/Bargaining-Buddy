import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentSearches = async () => {
      setLoading(true);
      setError(null);
      try {
        // --- CHANGE FETCH URL ---
        const res = await fetch('http://localhost:5000/products/recent-searches'); // Use the correct backend endpoint
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        // Data structure is now: { logId, product: { id, title, image, category }, timestamp }
        setRecentSearches(data);
      } catch (error) {
        console.error('Error fetching recent searches:', error);
        setError('Could not load recent searches.'); // Set error message
        setRecentSearches([]); // Clear any previous data on error
        // Remove fallback data or keep it for UI development if desired
      } finally {
          setLoading(false); // Stop loading indicator
      }
    };

    fetchRecentSearches();
  }, []); // Empty dependency array means run once on mount

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true // Use AM/PM
    });
  };

  // --- Adjust handleSearchClick to use product ID for detail view ---
  const handleSearchClick = (productId) => {
      // Navigate to the detail page using the MongoDB product ID
      navigate(`/comparison?search=${encodeURIComponent(productId)}`);
      // Or if you want to trigger a new general search:
      // navigate(`/result/${encodeURIComponent(query)}`); // Keep original behavior if needed
  };

  if (loading) {
      return <div className="text-center py-12">Loading recent searches...</div>;
  }

  if (error) {
       return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  if (!recentSearches.length) {
      // Optionally show a message instead of nothing
      return (
          <section className="py-12 bg-white">
              <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                  <div className="flex items-center mb-4">
                      <Clock className="w-6 h-6 mr-2 text-gray-500" />
                      <h2 className="text-2xl font-bold text-gray-900">Recent Searches</h2>
                  </div>
                  <p className="text-gray-600">You haven't viewed any products recently.</p>
              </div>
          </section>
      );
  }

  return (
    <section className="py-12 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Clock className="w-6 h-6 mr-2 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Recent Searches</h2>
          </div>
          {/* Keep or remove "View All" - requires separate implementation */}
          {/* <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </button> */}
        </div>

        <div className="overflow-hidden rounded-lg shadow-sm bg-gray-50">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {/* Add Image Column */}
                  <th scope="col" className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    {/* Combined Title/Category or just Title */}
                  </th>
                   <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Viewed On
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* --- Adjust map function to use new data structure --- */}
                {recentSearches.map((entry) => (
                  <tr key={entry.logId} className="hover:bg-gray-50">
                    {/* Image Cell */}
                    <td className="px-4 py-4 whitespace-nowrap">
                       {entry.product.image ? (
                           <img src={entry.product.image} alt={entry.product.title} className="w-10 h-10 object-contain rounded"/>
                       ) : (
                           <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400">?</div>
                       )}
                    </td>
                    {/* Title/Category Cell */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{entry.product.title}</div>
                      <div className="text-xs text-gray-500">{entry.product.category}</div>
                    </td>
                    {/* Date Cell */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(entry.timestamp)}</div>
                    </td>
                    {/* Action Cell */}
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <button
                        onClick={() => handleSearchClick(entry.product.id)} // Pass product ID
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
      </div>
    </section>
  );
};

export default RecentSearches;
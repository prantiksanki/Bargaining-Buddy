import React, { useState, useEffect } from 'react';  
import { Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentSearches = async () => {
      try {
        const res = await fetch('http://localhost:5000/user/recent-searches');
        const data = await res.json();
        setRecentSearches(data);
      } catch (error) {
        console.error('Error fetching recent searches:', error);
        // Fallback to sample data
        setRecentSearches([
          { id: 1, query: 'iPhone 15 Pro', timestamp: '2025-04-23T10:30:00' },
          { id: 2, query: 'Sony WH-1000XM4', timestamp: '2025-04-22T15:45:00' },
          { id: 3, query: 'Samsung Galaxy S24', timestamp: '2025-04-21T09:15:00' },
          { id: 4, query: 'MacBook Pro M3', timestamp: '2025-04-20T17:20:00' }
        ]);
      }
    };
    
    fetchRecentSearches();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleSearchClick = (query) => {
    navigate(`/result/${encodeURIComponent(query)}`);
  };

  if (!recentSearches.length) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Clock className="w-6 h-6 mr-2 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Recent Searches</h2>
          </div>
          <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        <div className="overflow-hidden rounded-lg shadow-sm bg-gray-50">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Search Query
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentSearches.map((search) => (
                  <tr key={search.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{search.query}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(search.timestamp)}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <button 
                        onClick={() => handleSearchClick(search.query)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Search Again
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
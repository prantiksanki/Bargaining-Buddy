import React from 'react';
import { Bell, TrendingDown, X, ExternalLink } from 'lucide-react';

const AlertDropdown = () => {
  // Sample alert data
  const alerts = [
    {
      id: 1,
      productName: 'Apple iPhone 15 Pro',
      targetPrice: 115000,
      currentPrice: 112990,
      retailer: 'Amazon',
      reached: true,
      image: '/api/placeholder/100/100'
    },
    {
      id: 2,
      productName: 'Sony WH-1000XM4 Wireless Headphones',
      targetPrice: 18000,
      currentPrice: 19990,
      retailer: 'Flipkart',
      reached: false,
      image: '/api/placeholder/100/100'
    },
    {
      id: 3,
      productName: 'Samsung Galaxy S24 Ultra',
      targetPrice: 110000,
      currentPrice: 109990,
      retailer: 'Croma',
      reached: true,
      image: '/api/placeholder/100/100'
    }
  ];

  return (
    <div className="overflow-hidden bg-white rounded-md shadow-lg">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Bell className="w-5 h-5 mr-2 text-blue-600" />
          <h3 className="font-medium text-gray-900">Price Alerts</h3>
        </div>
        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {alerts.length} Active
        </span>
      </div>
      
      <div className="overflow-y-auto max-h-72">
        {alerts.map((alert) => (
          <div key={alert.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
            <div className="flex">
              <div className="flex-shrink-0 w-12 h-12 mr-4 overflow-hidden bg-gray-100 rounded">
                <img src={alert.image} alt={alert.productName} className="object-cover w-full h-full" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {alert.productName}
                  </p>
                  <button className="ml-2 text-gray-400 hover:text-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center mt-1">
                  <TrendingDown className="w-4 h-4 mr-1 text-gray-500" />
                  <p className="text-xs text-gray-500">
                    Target: ₹{alert.targetPrice.toLocaleString()}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <p className="text-xs text-gray-500">
                      {alert.retailer} • Current price:
                    </p>
                    <p className={`text-sm font-medium ${alert.reached ? 'text-green-600' : 'text-blue-600'}`}>
                      ₹{alert.currentPrice.toLocaleString()}
                    </p>
                  </div>
                  
                  {alert.reached ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Price Reached!
                    </span>
                  ) : (
                    <a href="#" className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800">
                      View Details
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none">
          Manage All Alerts
        </button>
      </div>
    </div>
  );
};

export default AlertDropdown;
// src/pages/ProductPage.jsx
import React from 'react'
import { ExternalLink } from 'lucide-react'

export default function ProductPage() {
  const retailers = [
    { name: 'Amazon', price: 278.0, stock: true, url: 'https://www.amazon.in/' },
    { name: 'Best Buy', price: 299.99, stock: true, url: 'https://www.bestbuy.com/' },
    { name: 'Walmart', price: 289.0, stock: false, url: 'https://www.walmart.com/' },
    { name: 'Target', price: 299.99, stock: true, url: 'https://www.target.com/' },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto bg-gray-800 rounded-xl p-6 shadow-md">
        <h1 className="text-3xl font-bold mb-1">Apple iPhone 15 Pro</h1>
        <p className="text-gray-400 mb-6">Electronics</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image and Price */}
          <div>
            <img
              src="https://th.bing.com/th/id/OIP.Gg07sTXIip7kGhsjktdO-wHaEK?w=1920&h=1080&rs=1&pid=ImgDetMain"
              alt="iPhone 15 Pro"
              className="rounded-lg mb-4"
            />
            <p className="text-xl font-semibold">
              Rs. 278.00 - Rs. 349.99
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
              Set Price Alert
            </button>
          </div>

          {/* Price Comparison Table */}
          <div>
            <div className="flex justify-between items-center bg-gray-700 text-sm font-semibold px-4 py-2 rounded-t-lg">
              <p>Price Comparison</p>
              <p>Price</p>
            </div>
            <div className="bg-gray-800 rounded-b-lg divide-y divide-gray-700">
              {retailers.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className={`text-sm ${item.stock ? 'text-green-400' : 'text-red-400'}`}>
                      {item.stock ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-green-400">
                      Rs. {item.price.toFixed(2)}
                    </p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Visit ${item.name}`}
                    >
                      <ExternalLink className="w-5 h-5 text-blue-400 hover:text-blue-500" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-400">
            Industry-leading noise cancellation with Dual Noise Sensor technology
          </p>
        </div>
      </div>
    </div>
  )
}

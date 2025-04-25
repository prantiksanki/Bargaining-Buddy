// src/components/PriceAlertModal.js
import React, { useState } from 'react';
import { X } from 'lucide-react';

const PriceAlertModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    // Basic validation
    if (!email || !price) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    // Email format validation (basic)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          price: price,
          title: product.title,
          currentPrice: product.prices && product.prices.length > 0 ? product.prices[0].price : 'N/A',
          link: product.prices && product.prices.length > 0 ? product.prices[0].url : 'N/A',
          product: product, // Send the entire product object
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to set price alert');
      }

      setSuccessMessage('Price alert successfully set!');
      setEmail('');
      setPrice('');
      setTimeout(onClose, 2000); // Close after 2 seconds
      // onSubmit({ email, price }); // Notify parent component (optional)
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 bg-white shadow-lg rounded-xl">
        <button
          onClick={onClose}
          className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Set Price Alert</h2>
        {product && (
          <div className="mb-4">
            <p className="text-gray-700">
              You'll be notified when the price of{' '}
              <span className="font-medium">{product.title}</span> drops to your desired
              price.
            </p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="block w-full mt-1 border border-green-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Desired Price (Rs.)
            </label>
            <input
              type="number"
              id="price"
              className="block w-full mt-1 border border-green-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {successMessage && <p className="text-sm text-green-500">{successMessage}</p>}
          <div>
            <button
              type="submit"
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={isLoading}
            >
              {isLoading ? 'Setting Alert...' : 'Set Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PriceAlertModal;
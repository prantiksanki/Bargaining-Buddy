// src/components/PriceAlertModal.js
import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react'; // Added Loader2 for button loading state

const PriceAlertModal = ({ isOpen, onClose, product }) => {
  const [email, setEmail] = useState('');
  const [price, setPrice] = useState(''); // Using 'price' state name from functionality code
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Reset form when modal opens or product changes
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPrice('');
      setError('');
      setSuccessMessage('');
      setIsLoading(false);
    }
  }, [isOpen, product]);


  if (!isOpen || !product) return null;


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!email || !price) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    // Ensure price is a valid number greater than 0
     const numericPrice = parseFloat(price);
     if (isNaN(numericPrice) || numericPrice <= 0) {
       setError('Please enter a valid desired price greater than zero.');
       setIsLoading(false);
       return;
     }

    try {
      // Extract current price and link from the first retailer if available
      const currentPriceValue = product.prices && product.prices.length > 0 ? product.prices[0].price : 'N/A';
      const productLink = product.prices && product.prices.length > 0 ? product.prices[0].url : 'N/A';

      const response = await fetch('http://localhost:5000/alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          price: numericPrice, // Send the numeric value
          title: product.title,
          currentPrice: currentPriceValue,
          link: productLink,
          product: product, // Sending full product object as in functionality code
        }),
      });

      if (!response.ok) {
        // Try to parse error message from backend
        let errorDataMessage = 'Failed to set price alert';
        try {
            const errorData = await response.json();
            errorDataMessage = errorData.message || errorData.error || errorDataMessage;
        } catch (parseError) {
             // Keep default message if parsing fails
        }
        throw new Error(errorDataMessage);
      }

      // Assume success if response.ok is true
      setSuccessMessage('Price alert successfully set!');
      setEmail('');
      setPrice('');
      // Close modal automatically after a delay
      setTimeout(() => {
          onClose();
      }, 2000); // Close after 2 seconds

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div
        className={`bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md mx-4 transform transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={handleModalContentClick}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          aria-label="Close modal"
          disabled={isLoading}
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
           <img
             src={product.image?.replace('100x100', '200x200') || '/placeholder.jpg'}
             alt={product.title || 'Product'}
             className="w-24 h-24 object-contain mx-auto mb-4 rounded-lg border border-gray-200 bg-white"
             onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.jpg'; }}
           />
          <h2 className="text-2xl font-semibold text-gray-800">Set Price Alert</h2>
          <p className="text-sm text-gray-500 mt-1 px-4 truncate" title={product.title}>
            For: {product.title || 'Selected Product'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Notify me when price drops below:
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none">Rs.</span>
              <input
                type="number"
                id="price"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter your desired price"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                required
                step="0.01"
                min="0.01"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Send alert to:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
              required
            />
          </div>

          <div className="min-h-[20px] text-center">
             {error && <p className="text-sm text-red-600">{error}</p>}
             {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
          </div>


          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center py-3 px-4 font-semibold text-white rounded-full transition-all duration-300 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
            }`}
          >
            {isLoading ? (
               <>
                 <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                 Setting Alert...
               </>
             ) : (
              'Set Alert & Notify Me'
             )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PriceAlertModal;
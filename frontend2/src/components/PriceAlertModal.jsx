// src/components/PriceAlertModal.js
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PriceAlertModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [expectedPrice, setExpectedPrice] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Optional: for loading state
  const [error, setError] = useState(''); // For showing errors within the modal

  // Reset form when modal opens or product changes
  useEffect(() => {
    if (isOpen) {
      setExpectedPrice('');
      setEmail('');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null; // Don't render if not open or no product data

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Basic Validation
    if (!expectedPrice || isNaN(parseFloat(expectedPrice)) || parseFloat(expectedPrice) <= 0) {
      setError('Please enter a valid expected price.');
      return;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) { // Simple email regex
      setError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      // --- TODO: Replace with your actual API call ---
      console.log('Submitting alert:', {
        productId: product.id || product.title, // Use a unique ID if available
        productName: product.title,
        expectedPrice: parseFloat(expectedPrice),
        email: email,
      });
      // Simulating network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      // --- End of placeholder logic ---

      onSubmit({ expectedPrice: parseFloat(expectedPrice), email }); // Pass data back
      onClose(); // Close modal on successful submission
    } catch (err) {
      console.error("Failed to set price alert:", err);
      setError('Failed to set alert. Please try again.'); // Show error to user
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent clicks inside the modal from closing it
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Overlay
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose} // Close when clicking the overlay
    >
      {/* Modal Content */}
      <div
        className={`bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md mx-4 transform transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={handleModalContentClick} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
           <img
             src={product.image?.replace('100x100', '200x200') || '/placeholder.jpg'}
             alt={product.title || 'Product'}
             className="w-24 h-24 object-contain mx-auto mb-4 rounded-lg border border-gray-200"
             onError={(e) => (e.target.src = '/placeholder.jpg')}
           />
          <h2 className="text-2xl font-semibold text-gray-800">Set Price Alert</h2>
          <p className="text-sm text-gray-500 mt-1 truncate" title={product.title}>
            For: {product.title || 'Selected Product'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="expectedPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Notify me when price drops below:
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">Rs.</span>
              <input
                type="number"
                id="expectedPrice"
                name="expectedPrice"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(e.target.value)}
                placeholder="Enter your desired price"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
                step="0.01" // Allows decimal prices if needed
                min="0"
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
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>

          {/* Error Message Display */}
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 font-semibold text-white rounded-full transition-colors duration-300 ease-in-out ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg'
            }`}
          >
            {isSubmitting ? 'Setting Alert...' : 'Set Alert & Notify Me'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PriceAlertModal;
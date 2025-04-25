import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, ChevronRight, Plus, Heart, Bell } from 'lucide-react'; // Added Bell icon
import loadingAnimation from '../assets/Loading.json';
import { Player } from '@lottiefiles/react-lottie-player';
import PriceAlertModal from './PriceAlertModal'; // Import the modal component

const ProductPage = ({ searchQuery }) => {
  const location = useLocation();
  const query = searchQuery || new URLSearchParams(location.search).get('search');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for managing the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to hold the product data for the modal
  const [selectedProductForAlert, setSelectedProductForAlert] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) return;

      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`http://localhost:5000/scrape?id=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        console.log(data);
        setProducts(Array.isArray(data) ? data : [data]); // Ensure it's always an array
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  // --- Modal Handling Functions ---
  const handleOpenModal = (product) => {
    setSelectedProductForAlert(product); // Store the specific product
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProductForAlert(null); // Clear the selected product
  };

  const handleSetAlert = (alertData) => {
    // This function receives the data from the modal's onSubmit
    console.log('Price alert successfully set in ProductPage:', alertData);
    // You might want to show a success notification/toast here
    // The actual API call logic is inside the modal for this example,
    // but you could move it here if preferred.
  };
  // --- End Modal Handling ---


  // --- Render Logic (Loading, Error, No Products) ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Player
          autoplay
          loop
          src={loadingAnimation}
          style={{ height: '300px', width: '300px' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (products.length === 0 && !isLoading) { // Check !isLoading to avoid brief flash
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <p className="text-lg text-gray-500">
             {query ? `No products found for "${query}".` : 'Enter a search query to find products.'}
          </p>
        </div>
      );
  }

  // --- Main Product Display ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* We map products, assuming your API might eventually return multiple matches,
         but the UI seems designed for one main product view at a time.
         If you strictly expect only one product, you could access products[0]. */}
      {products.map((product, index) => (
        <div key={product.id || index} className="container px-4 py-8 mx-auto">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Column - Product Image and Details */}
            <div className="bg-[#f0f7f4] rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="relative mb-8">
                <img
                  src={product.image?.replace('100x100', '1100x1000') || '/placeholder.jpg'}
                  alt={product.title || 'Product image'}
                  className="object-contain w-full rounded-2xl"
                  style={{ maxHeight: '450px', minHeight: '300px' }} // Adjusted height
                  onError={(e) => (e.target.src = '/placeholder.jpg')}
                />
                <button className="absolute p-2 transition-all duration-200 bg-white rounded-full shadow-md top-4 right-4 hover:shadow-lg hover:scale-110">
                  <Heart className="w-5 h-5 text-gray-400 transition-colors hover:text-red-500" />
                </button>
              </div>

              <h1 className="mb-5 text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
                {product.title || 'Unnamed Product'}
              </h1>

              {/* --- Updated Price Alert Button --- */}
              <button
                onClick={() => handleOpenModal(product)} // Pass current product data
                className="flex items-center justify-center w-full gap-2 py-3 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md hover:shadow-lg hover:scale-[1.02]"
              >
                 <Bell size={18} /> Set Price Alert
              </button>
              {/* --- End Updated Button --- */}
            </div>

            {/* Right Column - Price Comparison */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Price Matrix</h2>
                {/* Search button functionality might need separate implementation */}
                {/* <button className="p-2 text-gray-500 transition-colors duration-200 rounded-full hover:bg-gray-200 hover:text-gray-700">
                  <Search className="w-6 h-6" />
                </button> */}
              </div>

              {/* Price Info - Check for prices array and its length */}
              {product.prices && product.prices.length > 0 ? (
                <>
                  {/* Highlighted Minimum Price Card */}
                  <div className="bg-gradient-to-r from-[#e8f5f0] to-[#d8f0e5] rounded-2xl p-5 md:p-6 mb-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-green-200">
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                      <div>
                        <p className="mb-1 text-xs font-semibold text-green-700 uppercase">Best Price Found</p>
                        <h3 className="mb-1 text-3xl font-bold text-green-800">
                          Rs. {product.prices[0].price}
                        </h3>
                        <p className="text-sm text-green-700">
                          {product.prices[0].retailer}
                          {/* Add stock status if available */}
                          {/* {product.prices[0].inStock ? ' (In Stock)' : ' (Check Stock)'} */}
                        </p>
                      </div>
                       <button
                          className="flex items-center gap-2 mt-2 sm:mt-0 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-300 bg-green-600 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm hover:shadow-md"
                          onClick={() => window.open(product.prices[0].url, '_blank', 'noopener,noreferrer')}
                        >
                           Go to Store <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                  </div>

                  {/* Price Comparison List */}
                  <div className="space-y-3">
                    {product.prices.map((item) => (
                      <a // Make the whole card clickable
                        key={item.url || item.retailer}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 transition-all duration-300 bg-white border border-gray-200 shadow-sm rounded-2xl hover:bg-gray-50 group hover:shadow-md hover:border-gray-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0 pr-4"> {/* Added for text overflow */}
                             <h3 className="font-medium text-gray-800 truncate">{item.retailer}</h3>
                             <p className="text-sm text-gray-500">
                               {/* Improved discount display */}
                               {item.discount && item.discount !== '0%'
                                  ? `${item.discount} Off`
                                  : 'Standard Price'}
                            </p>
                          </div>

                          <div className="flex items-center flex-shrink-0 gap-3 sm:gap-4">
                            <span className="text-lg font-semibold text-blue-600">
                              Rs. {item.price}
                            </span>
                            <ChevronRight
                              className="w-5 h-5 text-gray-400 transition-transform duration-200 group-hover:text-gray-600 group-hover:translate-x-1"
                            />
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                // Display when no price info is available
                <div className="p-6 text-center bg-gray-100 rounded-2xl">
                  <p className="text-gray-600">No price information currently available for this product.</p>
                </div>
              )}
            </div> {/* End Right Column */}
          </div> {/* End Grid */}
        </div> /* End Container */
      ))}

      {/* --- Render the Modal --- */}
      {/* It's placed outside the map, controlled by state */}
      <PriceAlertModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProductForAlert} // Pass the specific product data
        onSubmit={handleSetAlert}
      />
    </div> /* End Main Div */
  );
};

export default ProductPage;
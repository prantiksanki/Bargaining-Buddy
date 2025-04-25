import React from 'react';

const RecentSearches = () => {
  const reviews = [
    {
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      text: "Found the best prices on my favorite gadgets!",
      rating: 5,
      author: "Michael K."
    },
    {
      image: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      text: "The price tracking feature is a game-changer!",
      rating: 5,
      author: "Sophia L."
    },
    {
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      text: "Saved a lot on fashion items. Highly recommend BargainBuddy!",
      rating: 5,
      author: "Emma R."
    }
  ];

  return (
    <section className="px-4 py-12 mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Panel - Why BargainBuddy */}
        <div className="pr-0 border-gray-200 lg:pr-12 lg:border-r">
          <h2 className="mb-8 text-3xl font-bold text-gray-800">Why BargainBuddy?</h2>
          <div className="flex flex-col items-start space-y-6 md:flex-row md:space-y-0 md:space-x-6">
            <div className="flex-shrink-0 w-full h-32 overflow-hidden bg-gray-100 shadow-sm md:w-32 rounded-2xl">
              <img 
                src="https://images.pexels.com/photos/3760790/pexels-photo-3760790.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Bargain shopping" 
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-indigo-700">Find The Best Deals, Effortlessly</h3>
              <p className="mt-3 leading-relaxed text-gray-600">
                BargainBuddy helps you save money by tracking real-time price drops and offering comparisons across top retailers.
              </p>
              <p className="mt-4 leading-relaxed text-gray-600">
                Stay informed and get the best deals on Electronics, Fashion, Groceries, and more.
              </p>
              <button className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium transition-all duration-300 hover:bg-indigo-700 hover:shadow-md">
                Start Saving Today
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - User Reviews */}
        <div>
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
          
          <div className="mt-8 text-center">
            <a 
              href="#" 
              className="inline-flex items-center font-medium text-indigo-600 transition-colors duration-200 hover:text-indigo-800"
            >
              See all reviews
              <svg 
                className="w-4 h-4 ml-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentSearches;
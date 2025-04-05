const PopularComparisons = () => {
    return (
      <section className="bg-[#0a0f1c] px-6 py-16 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold mb-1">
            Popular Comparisons
          </h2>
          <p className="text-gray-400 mb-8">
            See what other shoppers are comparing right now
          </p>
  
          {/* Product Card */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#111827] rounded-lg overflow-hidden max-w-xs">
              <img
                src="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-model-unselect-gallery-2-202309?wid=5120&hei=2880&fmt=jpeg&qlt=80&.v=1692923767707"
                alt="iPhone 15 Pro"
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">Apple iPhone 15 Pro</h3>
                <p className="text-white mt-1">Rs.278</p>
                <p className="text-sm text-gray-400 mt-2">Electronics</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default PopularComparisons;
  
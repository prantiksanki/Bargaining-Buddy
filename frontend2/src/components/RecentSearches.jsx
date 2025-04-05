const RecentSearches = () => {
    const products = [
      {
        id: 1,
        name: 'Sony WH-1000XM4 Wireless Noise...',
        category: 'Electronics',
        description:
          'Industry-leading noise cancellation with Dual Noise Sensor technology',
        price: 'Rs. 278.00',
        image:
          'https://www.sony.co.in/image/22f06a99869c9b0489db871f11114856?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF',
      },
      {
        id: 2,
        name: 'Apple iPhone 15 Pro',
        category: 'Electronics',
        description:
          'Industry-leading noise cancellation with Dual Noise Sensor technology',
        price: 'Rs. 278.00',
        image:
          'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-model-unselect-gallery-2-202309?wid=5120&hei=2880&fmt=jpeg&qlt=80&.v=1692923767707',
      },
    ];
  
    return (
      <section className="bg-[#1f2937] text-white min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-1">Recent Searches</h2>
          <p className="text-gray-400 mb-8">Products you’ve recently viewed</p>
  
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-[#111827] rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg truncate">
                      {product.name}
                    </h3>
                    <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-gray-300 mt-2 text-sm">{product.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-semibold">{product.price}</span>
                    <button className="text-sm px-3 py-1 bg-gray-800 text-white border border-gray-600 rounded hover:bg-gray-700 transition">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default RecentSearches;
  
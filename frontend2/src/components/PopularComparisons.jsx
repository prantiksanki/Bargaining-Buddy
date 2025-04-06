import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import this

const PopularComparisons = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // ✅ Initialize navigate

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/popular');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching popular products:', error);
      }
    };
    fetchProducts();
  }, []);


  // {
  //   id: "4",
  //   name: "HP Pavilion 15.6 inch Laptop",
  //   image: "https://www.bhphotovideo.com/images/images2500x2500/sony_wh1000xm4_s_wh_1000xm4_wireless_noise_canceling_over_ear_1582976.jpg?height=300&width=300",
  //   price: 999.0,
  //   lowPrice: 900.0,
  //   highPrice: 1000.0,
  //   currentPrice: 950.0,
  //   url: "#",
  //   inStock: true,
  //   retailer: "Amazon",
  //   category: "Electronics",
  // }

  return (
    <section className="bg-[#0a0f1c] px-6 py-16 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-1 text-2xl font-semibold md:text-3xl">
          Popular Comparisons
        </h2>
        <p className="mb-8 text-gray-400">
          See what other shoppers are comparing right now
        </p>

        {/* Product Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
            key={product.id}
            className="bg-[#111827] rounded-lg overflow-hidden shadow-md"
          >
            <img
              src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'}
              alt={product.name || 'Product'}
              className="object-cover w-full h-64"
            />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold truncate">
                  {product.name || product.title || 'Unnamed Product'}
                </h3>
                <span className="px-2 py-1 text-xs text-white bg-gray-700 rounded-full">
                  {product.category || 'Uncategorized'}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-300">
                {product.description || 'No description available.'}
              </p>
              <div className="flex items-center justify-between mt-4">
                <span className="font-semibold">Rs. {product.lowPrice || 'N/A'}</span>
                <button
                  className="px-3 py-1 text-sm text-white transition bg-gray-800 border border-gray-600 rounded hover:bg-gray-700"
                  onClick={() => {
                    const name = product.name || product.title;
                    if (name?.trim()) {
                      navigate(`/comparison?search=${encodeURIComponent(name.toLowerCase())}`);
                    }
                  }}
                >
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

export default PopularComparisons;

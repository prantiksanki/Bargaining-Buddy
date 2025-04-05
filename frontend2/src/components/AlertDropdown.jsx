import React, { useEffect, useState } from 'react';

const AlertDropdown = () => {
  const [products, setProducts] = useState([]);

  // Fetch product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/alerts');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-72 max-h-80 overflow-y-auto rounded-md shadow-lg bg-[#0f172a] ring-1 ring-black ring-opacity-5 z-50">
      {products.length === 0 ? (
        <div className="p-4 text-gray-300 text-sm">No alerts yet.</div>
      ) : (
        <ul className="divide-y divide-gray-700">


          
          {products.map((product, index) => (
            <li
              key={product.id}
              className={`p-4 text-sm cursor-pointer ${
                index % 2 === 0 ? 'bg-[#1a2332]' : 'bg-[#0f172a]'
              } hover:bg-[#1f2937]`}
              onClick={() => window.open(product.url, "_blank")} // optional click action
            >
              <div className="font-semibold text-white truncate">
                {product.name}
              </div>
              <div className="text-gray-400">${product.price}</div>
              <div className="text-gray-500 text-xs">{product.retailer}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AlertDropdown;

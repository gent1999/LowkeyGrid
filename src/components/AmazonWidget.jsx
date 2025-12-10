import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function AmazonWidget({ page = 'home' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/amazon-products?page=${page}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching Amazon products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  if (loading) {
    return (
      <div className="bg-white border-2 border-gray-200 p-6">
        <h3 className="text-xl font-bold mb-4 text-orange-600">
          🎧 Recommended Gear
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null; // Don't show widget if no products
  }

  return (
    <>
      {products.map((item) => (
        <div key={item.id} className="bg-white border-2 border-gray-200 hover:border-orange-400 transition-all overflow-hidden">
          <a
            href={item.affiliate_link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block hover:opacity-90 transition-opacity"
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-auto"
              />
            )}
          </a>
        </div>
      ))}
    </>
  );
}

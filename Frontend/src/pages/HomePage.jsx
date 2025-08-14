import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import ProductCard from './../components/home/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState({
    fish: [],
    services: [],
    industrialStuff: []
  });

  // Refs for horizontal scrolling
  const fishScrollRef = useRef(null);
  const servicesScrollRef = useRef(null);
  const industrialScrollRef = useRef(null);

  useEffect(() => {
    fetchActiveProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      filterProductsByRole();
    }
  }, [products]);

  const fetchActiveProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products/active');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filterProductsByRole = () => {
    const fish = products.filter(product => product.role === 'Farm Owner');
    const services = products.filter(product => product.role === 'Service Provider');
    const industrialStuff = products.filter(product =>
        product.role === 'Industrial Stuff Seller'
    );

    setFilteredProducts({
      fish,
      services,
      industrialStuff
    });
  };

  const scroll = (ref, direction) => {
    const scrollAmount = 300;
    if (ref.current) {
      const scrollLeft = direction === 'left'
          ? ref.current.scrollLeft - scrollAmount
          : ref.current.scrollLeft + scrollAmount;

      ref.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const ScrollableSection = ({ title, products, scrollRef }) => (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>
          <div className="flex gap-2">
            <button
                onClick={() => scroll(scrollRef, 'left')}
                className="p-2 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 group"
                aria-label={`Scroll ${title} left`}
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
            </button>
            <button
                onClick={() => scroll(scrollRef, 'right')}
                className="p-2 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 group"
                aria-label={`Scroll ${title} right`}
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
            </button>
          </div>
        </div>

        <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitScrollbar: { display: 'none' }
            }}
        >
          {products.length > 0 ? (
              products.map((product) => (
                  <div key={product.id} className="flex-shrink-0">
                    <ProductCard product={product} />
                  </div>
              ))
          ) : (
              <div className="flex items-center justify-center w-full py-12">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-6" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">No {title.toLowerCase()} available</p>
                </div>
              </div>
          )}
        </div>
      </div>
  );

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Ornamental Fish Marketplace
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover premium ornamental fish, expert services, and quality industrial equipment
            </p>
          </div>

          {/* Fish Section */}
          <ScrollableSection
              title="Fish"
              products={filteredProducts.fish}
              scrollRef={fishScrollRef}
          />

          {/* Services Section */}
          <ScrollableSection
              title="Services"
              products={filteredProducts.services}
              scrollRef={servicesScrollRef}
          />

          {/* Industrial Stuffs Section */}
          <ScrollableSection
              title="Industrial Stuffs"
              products={filteredProducts.industrialStuff}
              scrollRef={industrialScrollRef}
          />
        </div>

        {/* Custom scrollbar styles */}
        <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      </div>
  );
};

export default HomePage;

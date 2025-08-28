import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BannerCarousel() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:8080/api/banners")
      .then(res => {
        // Fix: Backend returns data directly, not nested in banners property
        setBanners(res.data || []);
      })
      .catch(() => setBanners([]));
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Auto-scroll every 5 seconds

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-md mt-6">
        <div className="flex justify-center items-center py-12 bg-gray-100">
          <p className="text-gray-500">No banners available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-md mt-6">
      <div className="relative">
        {/* Banner Images */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((banner) => (
              <img
                key={banner.bannerId}
                src={`http://localhost:8080${banner.imageUrl}`}
                alt="Banner"
                className="w-full h-64 object-cover flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

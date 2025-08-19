import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BannerCarousel() {
  const [banners, setBanners] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8080/api/banners") // backend endpoint
      .then(res => setBanners(res.data.banners || []))
      .catch(() => setBanners([]));
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-md mt-6">
      {banners.length === 0 ? (
        <div className="flex justify-center items-center py-12">No banners available.</div>
      ) : (
        <div className="relative">
          {banners.map((banner, idx) => (
            <img
              key={banner.bannerId}
              src={banner.imageUrl}
              alt={`Banner ${idx + 1}`}
              className="w-full h-64 object-cover bg-gray-100"
            />
          ))}
        </div>
      )}
    </div>
  );
}

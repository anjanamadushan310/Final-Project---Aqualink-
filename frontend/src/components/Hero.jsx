import React from 'react';
import { Fish } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 py-24 text-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-blue-400 rounded-full opacity-10 animate-bounce delay-500"></div>
        <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-cyan-400 rounded-full opacity-10 animate-bounce delay-700"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-full shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300">
            <Fish className="h-16 w-16 text-white" />
          </div>
        </div>
        
        <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-800 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6 animate-fadeIn">
          Welcome to AquaLink
        </h2>
        
        <p className="text-xl md:text-2xl text-blue-700 mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover the most beautiful ornamental fish for your aquarium. Premium quality, expert care, delivered to your door.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:from-blue-700 hover:to-cyan-700">
            Shop Now
          </button>
          <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
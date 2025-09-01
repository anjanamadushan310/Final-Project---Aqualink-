import React, { useState, useCallback, useMemo } from 'react';
import { Star, Heart, MessageCircle, ShoppingCart, Truck, User } from 'lucide-react';

const ProductDetails = ({ fish, onClose, onPurchaseSuccess }) => {
  const [quantity, setQuantity] = useState(fish?.minimumQuantity || 1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  // Use fish data from props
  const productData = useMemo(() => ({
    name: fish?.name || "Fish Product",
    price: fish?.price || 0,
    rating: 4.9, // You can add this to your fish model later
    totalSold: 1500, // You can add this to your fish model later
    reviewCount: 21, // You can add this to your fish model later
    storeReviews: 3778, // You can add this to your fish model later
    minQuantity: fish?.minimumQuantity || 1,
    stock: fish?.stock || 0,
    description: fish?.description || "No description available",
    images: fish?.imageUrls || ['/images/default-fish.jpg']
  }), [fish]);

  // Memoized calculations
  const subtotal = useMemo(() => quantity * productData.price, [quantity, productData.price]);
  
  const formattedPrice = useMemo(() => 
    new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(productData.price), [productData.price]);

  const formattedSubtotal = useMemo(() => 
    new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(subtotal), [subtotal]);

  // Optimized event handlers
  const handleQuantityChange = useCallback((newQuantity) => {
    const validQuantity = Math.max(productData.minQuantity, parseInt(newQuantity) || productData.minQuantity);
    setQuantity(validQuantity);
  }, [productData.minQuantity]);

  const incrementQuantity = useCallback(() => {
    setQuantity(prev => prev + 1);
  }, []);

  const decrementQuantity = useCallback(() => {
    setQuantity(prev => Math.max(productData.minQuantity, prev - 1));
  }, [productData.minQuantity]);

  const handleImageSelect = useCallback((index) => {
    setSelectedImage(index);
  }, []);

  const toggleFavorite = useCallback(() => {
    setIsFavorited(prev => !prev);
  }, []);

  const handleAddToCart = useCallback(() => {
    // You can implement add to cart logic here
    console.log('Adding to cart:', { fish, quantity });
    if (onPurchaseSuccess) {
      onPurchaseSuccess({ fish, quantity });
    }
  }, [fish, quantity, onPurchaseSuccess]);

  // Star rating component
  const StarRating = ({ rating, size = 'w-4 h-4' }) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map(i => (
        <Star 
          key={i}
          className={`${size} ${
            i <= Math.floor(rating) 
              ? 'fill-yellow-400 text-yellow-400' 
              : i === Math.ceil(rating) && rating % 1 !== 0
                ? 'fill-yellow-200 text-yellow-200'
                : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
      <span className="ml-2 font-semibold text-sm">{rating}</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Product Info & Images */}
        <div>
          {/* Product Header */}
          <header className="mb-6">
            <h1 className="text-2xl font-bold mb-3">{productData.name}</h1>

            <div className="flex items-center gap-4 mb-3">
              <StarRating rating={productData.rating} />
              <span className="text-gray-600">{productData.totalSold.toLocaleString()} Sold</span>
              <button className="text-blue-600 hover:underline">
                ({productData.reviewCount} reviews)
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">AquaLife Store</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                ✓ Verified
              </span>
              <span className="text-gray-600">5 years</span>
            </div>
          </header>

          {/* Image Gallery */}
          <div className="flex gap-4">
            {/* Thumbnail Navigation */}
            <nav className="flex flex-col gap-2" aria-label="Product images">
              {productData.images.map((image, i) => (
                <button
                  key={i}
                  onClick={() => handleImageSelect(i)}
                  className={`w-16 h-16 border-2 rounded-lg overflow-hidden transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedImage === i ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img
                    src={image}
                    alt={`${productData.name} view ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </nav>

            {/* Main Image Display */}
            <div className="flex-1 relative">
              <div className="border border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
                <img
                  src={productData.images[selectedImage]}
                  alt={`${productData.name} - Main view`}
                  className="w-full h-80 object-cover transition-transform hover:scale-110"
                />
                
                {/* Favorite Button */}
                <button
                  onClick={toggleFavorite}
                  className="absolute top-4 right-4 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart 
                    className={`w-5 h-5 transition-colors ${
                      isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Purchase Options */}
        <div className="space-y-6">
          <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
            {/* Price Section */}
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-2">Price per fish</div>
              <div className="text-3xl font-bold text-green-600">{formattedPrice}</div>
              <div className="text-sm text-gray-600 mt-1">Stock: {productData.stock} available</div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= productData.minQuantity}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  min={productData.minQuantity}
                  max={productData.stock}
                  step={1}
                  className="w-20 text-center border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Quantity"
                />
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= productData.stock}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <span className="text-sm text-gray-500">min {productData.minQuantity}</span>
              </div>
            </div>

            {/* Subtotal */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold">Subtotal: {formattedSubtotal}</div>
              <div className="text-sm text-gray-600">({quantity} fish × {formattedPrice})</div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full py-3 px-4 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                <Truck className="w-5 h-5" />
                Select Delivery Option
              </button>
              <button 
                onClick={handleAddToCart}
                disabled={productData.stock === 0}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  productData.stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {productData.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button className="w-full py-3 px-4 border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Chat with Seller
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <section className="mt-8">
        <div className="border border-gray-300 rounded-lg p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Product Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {productData.description}
            </p>
            <ul className="mt-4 space-y-2">
              <li>• Minimum Quantity: {productData.minQuantity}</li>
              <li>• Available Stock: {productData.stock}</li>
              <li>• Temperature: 22-28°C</li>
              <li>• pH: 6.5-7.5</li>
              <li>• Lifespan: 2-3 years</li>
              <li>• Diet: Omnivore</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="mt-8">
        <div className="border border-gray-300 rounded-lg p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Ratings & Reviews</h2>

          <div className="flex gap-8 mb-6">
            <button className="text-blue-600 hover:underline focus:underline">
              Product reviews ({productData.reviewCount})
            </button>
            <button className="text-blue-600 hover:underline focus:underline">
              Store reviews ({productData.storeReviews.toLocaleString()})
            </button>
          </div>

          {/* Sample Review */}
          <article className="border-t pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium">Sarah Johnson</h3>
                  <span className="text-sm text-gray-500">2 weeks ago</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={4.5} />
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Beautiful healthy fish! They arrived in perfect condition and have been thriving in my tank. 
                  Great coloration and very active. Highly recommend this seller.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;

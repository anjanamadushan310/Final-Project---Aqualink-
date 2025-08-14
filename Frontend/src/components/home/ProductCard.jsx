

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-200">
        {product.image1 && (
          <img 
            src={`/uploads/${product.image1}`}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
        {product.verified && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            Verified
          </span>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.town}</p>
        <p className="text-gray-700 text-sm mb-3 line-clamp-3">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">
            Rs. {product.price?.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">
            Stock: {product.stock}
          </span>
        </div>
        
        <button className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
          Buy
        </button>
      </div>
    </div>
  );
};
export default ProductCard;
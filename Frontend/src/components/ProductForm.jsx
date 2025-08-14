import React, { useState } from 'react';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    role: '',
    userId: '',
    town: '',
    stock: '',
    price: '',
    howManyYearsOld: '',
    verified: false
  });
  
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    
    setSelectedImages(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    
    // Add form fields
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    // Add images
    selectedImages.forEach((image, index) => {
      formDataToSend.append(`image${index + 1}`, image);
    });

    try {
      const response = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('Product added successfully!');
        // Reset form
        setFormData({
          name: '',
          description: '',
          role: '',
          userId: '',
          town: '',
          stock: '',
          price: '',
          howManyYearsOld: '',
          verified: false
        });
        setSelectedImages([]);
        setImagePreviews([]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Images (Max 5) *
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mt-3">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role *
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User ID *
          </label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Town *
          </label>
          <input
            type="text"
            name="town"
            value={formData.town}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock *
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price *
          </label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            How Many Years Old
          </label>
          <input
            type="number"
            name="howManyYearsOld"
            value={formData.howManyYearsOld}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="verified"
            checked={formData.verified}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700">
            Verified Product
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;

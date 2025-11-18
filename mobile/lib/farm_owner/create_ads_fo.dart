import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class create_ads_fo extends StatefulWidget {
  const create_ads_fo({super.key});

  @override
  State<create_ads_fo> createState() => _CreateAdsFoState();
}

class _CreateAdsFoState extends State<create_ads_fo> {
  // Controllers for each text field to manage their state
  final _productNameController = TextEditingController();
  final _stockController = TextEditingController();
  final _priceController = TextEditingController();
  final _minQuantityController = TextEditingController();
  final _descriptionController = TextEditingController();

  // Add this for multiple image selection
  List<XFile> _selectedImages = [];

  @override
  void dispose() {
    // Dispose controllers when the widget is removed from the widget tree
    _productNameController.dispose();
    _stockController.dispose();
    _priceController.dispose();
    _minQuantityController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // AppBar with the title as shown in the image
      appBar: AppBar(
        title: const Text('Add New Product'),
        backgroundColor: Colors.white,
        elevation: 1,
        foregroundColor: Colors.black,
      ),
      body: SingleChildScrollView(
        // Padding for the form
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product Name Field
            const Text(
              'Product Name *',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _productNameController,
              decoration: InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8.0),
                ),
                hintText: 'Enter product name',
              ),
            ),
            const SizedBox(height: 20),

            // Product Images Field
            const Text(
              'Product Images (Max 5) *',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                ElevatedButton(
                  onPressed: () async {
                    final ImagePicker picker = ImagePicker();
                    final List<XFile>? images = await picker.pickMultiImage(
                      imageQuality: 80,
                    );

                    if (images != null) {
                      setState(() {
                        _selectedImages = images;
                      });
                      for (var image in images) {
                        print('File selected: ${image.path}');
                      }
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.lightBlue[50],
                    foregroundColor: Colors.blue[800],
                    elevation: 0,
                  ),
                  child: const Text('Choose Files'),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    _selectedImages.isEmpty
                        ? 'No files chosen'
                        : '${_selectedImages.length} files selected',
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Display selected images
            if (_selectedImages.isNotEmpty)
              GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  childAspectRatio: 1.0,
                  crossAxisSpacing: 8.0,
                  mainAxisSpacing: 8.0,
                ),
                itemCount: _selectedImages.length,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemBuilder: (context, index) {
                  return ClipRRect(
                    borderRadius: BorderRadius.circular(8.0),
                    child: Image.file(
                      File(_selectedImages[index].path),
                      fit: BoxFit.cover,
                    ),
                  );
                },
              ),
            if (_selectedImages.isNotEmpty) const SizedBox(height: 20),

            // Stock Field
            const Text(
              'Stock *',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _stockController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8.0),
                ),
                hintText: 'Enter stock quantity',
              ),
            ),
            const SizedBox(height: 20),

            // Price Field
            const Text(
              'Price *',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _priceController,
              keyboardType: const TextInputType.numberWithOptions(
                decimal: true,
              ),
              decoration: InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8.0),
                ),
                hintText: 'Enter price',
              ),
            ),
            const SizedBox(height: 20),

            // Minimum Quantity Field
            const Text(
              'Minimum Quantity *',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _minQuantityController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8.0),
                ),
                hintText: 'Enter minimum quantity',
              ),
            ),
            const SizedBox(height: 20),

            // Description Field
            const Text(
              'Description',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _descriptionController,
              maxLines: 5,
              decoration: InputDecoration(
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8.0),
                ),
                hintText: 'Enter product description',
              ),
            ),
            const SizedBox(height: 30),

            // Add Product Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // TODO: Implement form submission logic.
                  // You can access the field values using the controllers, e.g., _productNameController.text
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                  backgroundColor: Colors.blue, // As shown in the image
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                ),
                child: const Text(
                  'Add Product',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

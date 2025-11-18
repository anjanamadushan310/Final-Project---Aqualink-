import 'dart:io';

import 'package:aqua_link/authentication/login.dart';
import 'package:aqua_link/pages/about_page.dart';
import 'package:aqua_link/pages/cart_page.dart';
import 'package:aqua_link/pages/contact_page.dart';
import 'package:aqua_link/pages/home_page.dart';
import 'package:aqua_link/pages/my_profile_page.dart';
import 'package:aqua_link/pages/profile_page.dart';
import 'package:aqua_link/services/profile_service.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;
  XFile? _selectedImage;
  String _businessName = '';
  String _businessAddress = '';

  // Individual address components for drawer display
  String _place = '';
  String _street = '';
  String _district = '';
  String _town = '';

  @override
  void initState() {
    super.initState();
    _loadProfileData();
  }

  void _onPressedNavItems(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  Future<void> _loadProfileData() async {
    final businessName = await ProfileService.getBusinessName();
    final address = await ProfileService.getAddress();
    final imagePath = await ProfileService.getProfileImage();

    setState(() {
      _businessName = businessName ?? 'Business Name';

      // Store individual address components
      _place = address['place'] ?? '';
      _street = address['street'] ?? '';
      _district = address['district'] ?? '';
      _town = address['town'] ?? '';

      // Format address string
      final addressParts = <String>[];
      if (_place.isNotEmpty) addressParts.add(_place);
      if (_street.isNotEmpty) addressParts.add(_street);
      if (_district.isNotEmpty) addressParts.add(_district);
      if (_town.isNotEmpty) addressParts.add(_town);

      _businessAddress = addressParts.isNotEmpty
          ? addressParts.join(', ')
          : 'Add your business address';

      if (imagePath != null && imagePath.isNotEmpty) {
        _selectedImage = XFile(imagePath);
      }
    });
  }

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      setState(() {
        _selectedImage = pickedFile;
      });
      // Save image path
      await ProfileService.saveProfileImage(pickedFile.path);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color.fromARGB(255, 82, 220, 237),
        title: const Text('AquaLink', style: TextStyle(fontSize: 24)),
        centerTitle: false,
      ),
      body: IndexedStack(
        index: _selectedIndex,
        children: [
          HomePage(),
          ProfilePage(),
          CartPage(),
          AboutPage(),
          ContactPage(),
        ],
      ),
      drawer: Drawer(
        child: Column(
          children: [
            Expanded(
              child: ListView(
                padding: EdgeInsets.zero,
                children: [
                  DrawerHeader(
                    decoration: BoxDecoration(
                      color: const Color.fromARGB(255, 115, 218, 230),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            // Profile image display only (no camera icon)
                            SizedBox(
                              width: 80,
                              height: 80,
                              child: CircleAvatar(
                                backgroundImage: _selectedImage != null
                                    ? (kIsWeb
                                              ? NetworkImage(
                                                  _selectedImage!.path,
                                                )
                                              : FileImage(
                                                  File(_selectedImage!.path),
                                                ))
                                          as ImageProvider
                                    : null,
                                child: _selectedImage == null
                                    ? Icon(Icons.person, size: 40)
                                    : null,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    _businessName,
                                    style: const TextStyle(
                                      color: Colors.black,
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 8),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  ListTile(
                    leading: Icon(Icons.person_2_outlined),
                    title: Text('My Profile'),
                    onTap: () async {
                      Navigator.pop(context); // Close drawer first
                      await Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const MyProfilePage(),
                        ),
                      );
                      // Reload profile data when returning from profile page
                      _loadProfileData();
                    },
                  ),
                  // Profile data display items
                  if (_businessName.isNotEmpty &&
                      _businessName != 'Business Name')
                    ListTile(
                      leading: Icon(Icons.business, color: Colors.grey),
                      title: Text('Business Name'),
                      subtitle: Text(
                        _businessName,
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      dense: true,
                    ),
                  if (_place.isNotEmpty)
                    ListTile(
                      leading: Icon(Icons.home, color: Colors.grey),
                      title: Text('Place'),
                      subtitle: Text(
                        _place,
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      dense: true,
                    ),
                  if (_street.isNotEmpty)
                    ListTile(
                      leading: Icon(Icons.add_road, color: Colors.grey),
                      title: Text('Street'),
                      subtitle: Text(
                        _street,
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      dense: true,
                    ),
                  if (_town.isNotEmpty)
                    ListTile(
                      leading: Icon(Icons.location_city, color: Colors.grey),
                      title: Text('Town'),
                      subtitle: Text(
                        _town,
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      dense: true,
                    ),
                  if (_district.isNotEmpty)
                    ListTile(
                      leading: Icon(Icons.map, color: Colors.grey),
                      title: Text('District'),
                      subtitle: Text(
                        _district,
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      dense: true,
                    ),
                ],
              ),
            ),
            const Divider(),
            ListTile(
              leading: Icon(Icons.logout),
              title: Text('Logout'),
              onTap: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginScreen()),
                );
              },
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: const Color.fromARGB(255, 82, 220, 237),
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_cart),
            label: 'Cart',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.info), label: 'About'),
          BottomNavigationBarItem(
            icon: Icon(Icons.contact_support),
            label: 'Contact',
          ),
        ],
        currentIndex: _selectedIndex,
        onTap: _onPressedNavItems,
      ),
    );
  }
}

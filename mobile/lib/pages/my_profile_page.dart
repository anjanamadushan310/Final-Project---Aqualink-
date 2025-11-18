import 'dart:io';

import 'package:aqua_link/services/profile_service.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class MyProfilePage extends StatefulWidget {
  const MyProfilePage({super.key});

  @override
  State<MyProfilePage> createState() => _MyProfilePageState();
}

class _MyProfilePageState extends State<MyProfilePage> {
  XFile? _selectedImage;

  // Text controllers for form fields
  final TextEditingController _businessNameController = TextEditingController();
  final TextEditingController _placeController = TextEditingController();
  final TextEditingController _streetController = TextEditingController();

  // Selected values for dropdowns
  String? _selectedDistrict;
  String? _selectedTown;

  // Sri Lankan districts
  final List<String> _districts = [
    'Ampara',
    'Anuradhapura',
    'Badulla',
    'Batticaloa',
    'Colombo',
    'Galle',
    'Gampaha',
    'Hambantota',
    'Jaffna',
    'Kalutara',
    'Kandy',
    'Kegalle',
    'Kilinochchi',
    'Kurunegala',
    'Mannar',
    'Matale',
    'Matara',
    'Monaragala',
    'Mullaitivu',
    'Nuwara Eliya',
    'Polonnaruwa',
    'Puttalam',
    'Ratnapura',
    'Trincomalee',
    'Vavuniya',
  ];

  // Towns by district
  final Map<String, List<String>> _townsByDistrict = {
    'Ampara': [
      'Ampara',
      'Akkaraipattu',
      'Kalmunai',
      'Sammanthurai',
      'Nintavur',
      'Damana',
      'Mahaoya',
    ],
    'Anuradhapura': [
      'Anuradhapura',
      'Kekirawa',
      'Thambuttegama',
      'Eppawala',
      'Medawachchiya',
      'Galenbindunuwewa',
    ],
    'Badulla': [
      'Badulla',
      'Bandarawela',
      'Ella',
      'Haputale',
      'Welimada',
      'Mahiyanganaya',
      'Passara',
    ],
    'Batticaloa': [
      'Batticaloa',
      'Kaluwanchikudy',
      'Valachchenai',
      'Eravur',
      'Chenkaladi',
      'Oddamavadi',
    ],
    'Colombo': [
      'Colombo',
      'Dehiwala-Mount Lavinia',
      'Moratuwa',
      'Sri Jayawardenepura Kotte',
      'Maharagama',
      'Kesbewa',
      'Kaduwela',
      'Kolonnawa',
    ],
    'Galle': [
      'Galle',
      'Hikkaduwa',
      'Ambalangoda',
      'Elpitiya',
      'Bentota',
      'Baddegama',
      'Neluwa',
    ],
    'Gampaha': [
      'Negombo',
      'Gampaha',
      'Ja-Ela',
      'Wattala',
      'Kelaniya',
      'Peliyagoda',
      'Minuwangoda',
      'Katunayake',
    ],
    'Hambantota': [
      'Hambantota',
      'Tangalle',
      'Tissamaharama',
      'Ambalantota',
      'Beliatta',
      'Weeraketiya',
    ],
    'Jaffna': [
      'Jaffna',
      'Chavakachcheri',
      'Point Pedro',
      'Karainagar',
      'Velanai',
      'Delft',
    ],
    'Kalutara': [
      'Kalutara',
      'Panadura',
      'Horana',
      'Beruwala',
      'Aluthgama',
      'Matugama',
      'Ingiriya',
    ],
    'Kandy': [
      'Kandy',
      'Gampola',
      'Nawalapitiya',
      'Wattegama',
      'Harispattuwa',
      'Pathadumbara',
      'Akurana',
    ],
    'Kegalle': [
      'Kegalle',
      'Mawanella',
      'Warakapola',
      'Rambukkana',
      'Galigamuwa',
      'Yatiyantota',
    ],
    'Kilinochchi': ['Kilinochchi', 'Pallai', 'Paranthan', 'Poonakary'],
    'Kurunegala': [
      'Kurunegala',
      'Kuliyapitiya',
      'Narammala',
      'Wariyapola',
      'Pannala',
      'Melsiripura',
      'Galgamuwa',
    ],
    'Mannar': ['Mannar', 'Nanattan', 'Madhu', 'Pesalai'],
    'Matale': ['Matale', 'Dambulla', 'Sigiriya', 'Naula', 'Ukuwela', 'Rattota'],
    'Matara': [
      'Matara',
      'Weligama',
      'Mirissa',
      'Akuressa',
      'Hakmana',
      'Devinuwara',
      'Dickwella',
    ],
    'Monaragala': [
      'Monaragala',
      'Wellawaya',
      'Buttala',
      'Kataragama',
      'Bibile',
      'Medagama',
    ],
    'Mullaitivu': ['Mullaitivu', 'Puthukkudiyiruppu', 'Oddusuddan', 'Mankulam'],
    'Nuwara Eliya': [
      'Nuwara Eliya',
      'Hatton',
      'Talawakele',
      'Ginigathena',
      'Kotagala',
      'Maskeliya',
    ],
    'Polonnaruwa': [
      'Polonnaruwa',
      'Kaduruwela',
      'Medirigiriya',
      'Hingurakgoda',
      'Dimbulagala',
    ],
    'Puttalam': [
      'Puttalam',
      'Chilaw',
      'Wennappuwa',
      'Marawila',
      'Nattandiya',
      'Dankotuwa',
    ],
    'Ratnapura': [
      'Ratnapura',
      'Embilipitiya',
      'Balangoda',
      'Pelmadulla',
      'Eheliyagoda',
      'Kuruwita',
    ],
    'Trincomalee': [
      'Trincomalee',
      'Kinniya',
      'Mutur',
      'Kantale',
      'Kuchchaveli',
    ],
    'Vavuniya': ['Vavuniya', 'Nedunkerni', 'Settikulam', 'Omanthai'],
  };

  List<String> get _availableTowns {
    if (_selectedDistrict == null) return [];
    return _townsByDistrict[_selectedDistrict] ?? [];
  }

  @override
  void initState() {
    super.initState();
    _loadProfileData();
  }

  @override
  void dispose() {
    _businessNameController.dispose();
    _placeController.dispose();
    _streetController.dispose();
    super.dispose();
  }

  Future<void> _loadProfileData() async {
    final businessName = await ProfileService.getBusinessName();
    final address = await ProfileService.getAddress();
    final imagePath = await ProfileService.getProfileImage();

    setState(() {
      _businessNameController.text = businessName ?? '';
      _placeController.text = address['place'] ?? '';
      _streetController.text = address['street'] ?? '';

      // Validate district exists in the list before setting
      final savedDistrict = address['district'];
      if (savedDistrict != null &&
          savedDistrict.isNotEmpty &&
          _districts.contains(savedDistrict)) {
        _selectedDistrict = savedDistrict;

        // Validate town exists for the selected district
        final savedTown = address['town'];
        final availableTowns = _townsByDistrict[savedDistrict] ?? [];
        if (savedTown != null &&
            savedTown.isNotEmpty &&
            availableTowns.contains(savedTown)) {
          _selectedTown = savedTown;
        } else {
          _selectedTown = null;
        }
      } else {
        _selectedDistrict = null;
        _selectedTown = null;
      }

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
      // Save image path immediately
      await ProfileService.saveProfileImage(pickedFile.path);
    }
  }

  Future<void> _saveProfile() async {
    try {
      // Save business name
      await ProfileService.saveBusinessName(_businessNameController.text);

      // Save address
      await ProfileService.saveAddress(
        place: _placeController.text,
        street: _streetController.text,
        district: _selectedDistrict ?? '',
        town: _selectedTown ?? '',
      );

      // Show success message
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profile saved successfully!'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      // Show error message
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error saving profile: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Business Profile')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Stack(
                    children: [
                      CircleAvatar(
                        radius: 80,
                        backgroundImage: _selectedImage != null
                            ? (kIsWeb
                                      ? NetworkImage(_selectedImage!.path)
                                      : FileImage(File(_selectedImage!.path)))
                                  as ImageProvider
                            : null,
                        child: _selectedImage == null
                            ? Icon(Icons.person, size: 60)
                            : null,
                      ),
                      Positioned(
                        bottom: 12,
                        left: 120,
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                          ),
                          child: InkWell(
                            onTap: _pickImage,
                            child: Padding(
                              padding: const EdgeInsets.all(4.0),
                              child: Icon(Icons.camera_alt_rounded, size: 28),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Text(
                'Business Name',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _businessNameController,
                decoration: InputDecoration(
                  border: OutlineInputBorder(),
                  hintText: 'Enter your business name',
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Business Address',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _placeController,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(),
                        label: Text('Place (House No.)'),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextField(
                      controller: _streetController,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(),
                        label: Text('Street'),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  // Town dropdown (left side)
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      key: Key('town_dropdown_${_selectedDistrict ?? 'none'}'),
                      value: _selectedTown,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(),
                        label: Text('Town'),
                      ),
                      hint: Text(
                        _selectedDistrict == null
                            ? 'Select District First'
                            : 'Select Town',
                      ),
                      isExpanded: true,
                      items: _selectedDistrict != null
                          ? (_townsByDistrict[_selectedDistrict] ?? []).map((
                              town,
                            ) {
                              return DropdownMenuItem<String>(
                                value: town,
                                child: Text(
                                  town,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              );
                            }).toList()
                          : [],
                      onChanged: _selectedDistrict != null
                          ? (value) {
                              setState(() {
                                _selectedTown = value;
                              });
                            }
                          : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  // District dropdown (right side)
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      key: Key('district_dropdown'),
                      value: _selectedDistrict,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(),
                        label: Text('District'),
                      ),
                      hint: Text('Select District'),
                      isExpanded: true,
                      items: _districts.map((district) {
                        return DropdownMenuItem<String>(
                          value: district,
                          child: Text(
                            district,
                            overflow: TextOverflow.ellipsis,
                          ),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedDistrict = value;
                          _selectedTown =
                              null; // Reset town when district changes
                        });
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _saveProfile,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color.fromARGB(255, 82, 220, 237),
                    foregroundColor: Colors.white,
                  ),
                  child: const Text(
                    'Save Profile',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

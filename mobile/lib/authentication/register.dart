import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:intl_phone_field/intl_phone_field.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final _nicController = TextEditingController();
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _optController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _passwordVisible = false;
  bool _confirmPasswordVisible = false;
  bool _isEmailVerified = false;
  bool _isFrontNICUploaded = false;
  bool _isBackNICUploaded = false;
  bool _selfieFileUploaded = false;

  // Phone number variables
  String _completePhoneNumber = '';
  String _phoneNumber = '';
  String _countryCode = '';
  bool _isPhoneValid = false;

  // File variables
  File? _nicFrontFile;
  File? _nicBackFile;
  File? _selfieFile;
  String? _nicFrontFileName;
  String? _nicBackFileName;
  String? _selfieFileName;

  List<String> _selectedRoles = [];

  final List<String> _roles = [
    'Shop Owner',
    'Farm Owner',
    'Collector',
    'Service Provider',
    'Industrial Stuff Seller',
    'Delivery Person',
  ];

  @override
  void initState() {
    super.initState();
    // Remove service initialization
  }

  @override
  void dispose() {
    _nicController.dispose();
    _fullNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _optController.dispose();
    super.dispose();
  }

  void _sendOTP() async {
    if (_emailController.text.isEmpty || !_emailController.text.contains('@')) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid email address')),
      );
      return;
    }

    // Simulate OTP sending
    await Future.delayed(const Duration(seconds: 2));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('OTP sent successfully (simulated)')),
    );
  }

  void _verifyEmail() async {
    if (_emailController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter your email first')),
      );
      return;
    }

    if (_optController.text.isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Please enter the OTP')));
      return;
    }

    // Simulate OTP verification (accept any 6-digit OTP)
    if (_optController.text.length == 6) {
      setState(() {
        _isEmailVerified = true;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Email verified successfully (simulated)'),
        ),
      );
    } else {
      setState(() {
        _isEmailVerified = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a valid 6-digit OTP')),
      );
    }
  }

  String? _validateDocuments() {
    // Check if at least one document is provided
    if (_nicFrontFile == null && _nicBackFile == null && _selfieFile == null) {
      return 'At least one document is required';
    }

    // Validate each document if provided
    final documents = [
      {'file': _nicFrontFile, 'name': 'NIC Front'},
      {'file': _nicBackFile, 'name': 'NIC Back'},
      {'file': _selfieFile, 'name': 'Selfie'},
    ];

    for (var doc in documents) {
      final file = doc['file'] as File?;
      final name = doc['name'] as String;

      if (file != null) {
        if (!file.existsSync()) {
          return '$name file does not exist';
        }

        // Validate file size (max 5MB)
        final bytes = file.lengthSync();
        final mb = bytes / (1024 * 1024);
        if (mb > 5) {
          return '$name file size must be less than 5MB';
        }

        // Validate file type
        final extension = file.path.split('.').last.toLowerCase();
        if (!['png', 'jpg', 'jpeg'].contains(extension)) {
          return '$name must be PNG, JPG, or JPEG format';
        }
      }
    }

    return null; // All validations passed
  }

  void _registerUser() async {
    if (_formKey.currentState!.validate()) {
      // Validate documents before proceeding
      final documentValidation = _validateDocuments();

      if (documentValidation != null) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(documentValidation)));
        return;
      }

      if (_selectedRoles.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please select at least one role')),
        );
        return;
      }

      if (!_isEmailVerified) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please verify your email first')),
        );
        return;
      }

      // Check if phone number is valid
      if (!_isPhoneValid || _completePhoneNumber.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please enter a valid phone number')),
        );
        return;
      }

      // Show loading indicator
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (BuildContext context) {
          return const Center(child: CircularProgressIndicator());
        },
      );

      // Simulate registration process
      await Future.delayed(const Duration(seconds: 3));

      Navigator.of(context).pop();

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Registration successful (simulated)'),
          backgroundColor: Colors.blue,
        ),
      );

      Navigator.of(context).pop();
    }
  }

  void _checkExistingUser() async {
    // Simulate checking existing user - always return false for demo
    await Future.delayed(const Duration(seconds: 1));

    // This is now a placeholder function that doesn't perform actual validation
    // In a real implementation, you would connect to your backend here
  }

  void _toggleRole(String role) {
    setState(() {
      if (_selectedRoles.contains(role)) {
        _selectedRoles.remove(role);
      } else {
        _selectedRoles.add(role);
      }
    });
  }

  Future<void> _pickNicFrontFile() async {
    try {
      final XFile? image = await ImagePicker().pickImage(
        source: ImageSource.gallery,
        imageQuality: 100,
      );
      if (image != null) {
        setState(() {
          _nicFrontFile = File(image.path);
          _nicFrontFileName = image.name;
          _isFrontNICUploaded = true;
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error picking file: $e')));
    }
  }

  Future<void> _pickNicBackFile() async {
    try {
      final XFile? image = await ImagePicker().pickImage(
        source: ImageSource.gallery,
        imageQuality: 100,
      );
      if (image != null) {
        setState(() {
          _nicBackFile = File(image.path);
          _nicBackFileName = image.name;
          _isBackNICUploaded = true;
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error picking file: $e')));
    }
  }

  Future<void> _pickSelfieFile() async {
    try {
      final XFile? image = await ImagePicker().pickImage(
        source: ImageSource.camera,
        imageQuality: 100,
      );
      if (image != null) {
        setState(() {
          _selfieFile = File(image.path);
          _selfieFileName = image.name;
          _selfieFileUploaded = true;
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error picking file: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Register'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 20),

              // NIC Number Field
              TextFormField(
                controller: _nicController,
                decoration: const InputDecoration(
                  labelText: 'NIC Number',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.credit_card),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your NIC number';
                  }
                  final nicPattern = RegExp(r'^([0-9]{9}[vVxX]|[0-9]{12})$');
                  if (!nicPattern.hasMatch(value)) {
                    return 'Invalid NIC format';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Full Name Field
              TextFormField(
                controller: _fullNameController,
                decoration: const InputDecoration(
                  labelText: 'Full Name',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.person),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your full name';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Email Field with OTP
              Row(
                children: [
                  Expanded(
                    flex: 3,
                    child: TextFormField(
                      controller: _emailController,
                      decoration: InputDecoration(
                        labelText: 'Email',
                        border: const OutlineInputBorder(),
                        prefixIcon: const Icon(Icons.email),
                        suffixIcon: _isEmailVerified
                            ? const Icon(Icons.check_circle, color: Colors.blue)
                            : null,
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your email';
                        }
                        final emailPattern = RegExp(
                          r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
                        );
                        if (!emailPattern.hasMatch(value)) {
                          return 'Invalid email format';
                        }
                        return null;
                      },
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    flex: 1,
                    child: ElevatedButton(
                      onPressed: _sendOTP,
                      child: const Text('Send OTP'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // OTP Field
              Row(
                children: [
                  Expanded(
                    flex: 3,
                    child: TextFormField(
                      controller: _optController,
                      decoration: const InputDecoration(
                        labelText: 'Enter OTP',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.security),
                      ),
                      keyboardType: TextInputType.number,
                      maxLength: 6,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    flex: 1,
                    child: ElevatedButton(
                      onPressed: _verifyEmail,
                      child: const Text('Verify'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Phone Number Field
              IntlPhoneField(
                decoration: const InputDecoration(
                  labelText: 'Phone Number',
                  border: OutlineInputBorder(),
                ),
                initialCountryCode: 'LK',
                onChanged: (phone) {
                  setState(() {
                    _completePhoneNumber = phone.completeNumber;
                    _phoneNumber = phone.number;
                    _countryCode = phone.countryCode;
                    _isPhoneValid = phone.isValidNumber();
                  });
                },
              ),
              const SizedBox(height: 16),

              // Password Field
              TextFormField(
                controller: _passwordController,
                obscureText: !_passwordVisible,
                decoration: InputDecoration(
                  labelText: 'Password',
                  border: const OutlineInputBorder(),
                  prefixIcon: const Icon(Icons.lock),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _passwordVisible
                          ? Icons.visibility
                          : Icons.visibility_off,
                    ),
                    onPressed: () {
                      setState(() {
                        _passwordVisible = !_passwordVisible;
                      });
                    },
                  ),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a password';
                  }
                  if (value.length < 6) {
                    return 'Password must be at least 6 characters';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Confirm Password Field
              TextFormField(
                controller: _confirmPasswordController,
                obscureText: !_confirmPasswordVisible,
                decoration: InputDecoration(
                  labelText: 'Confirm Password',
                  border: const OutlineInputBorder(),
                  prefixIcon: const Icon(Icons.lock_outline),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _confirmPasswordVisible
                          ? Icons.visibility
                          : Icons.visibility_off,
                    ),
                    onPressed: () {
                      setState(() {
                        _confirmPasswordVisible = !_confirmPasswordVisible;
                      });
                    },
                  ),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please confirm your password';
                  }
                  if (value != _passwordController.text) {
                    return 'Passwords do not match';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Role Selection
              const Text(
                'Select Your Role(s):',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8.0,
                children: _roles.map((role) {
                  final isSelected = _selectedRoles.contains(role);
                  return FilterChip(
                    label: Text(role),
                    selected: isSelected,
                    onSelected: (selected) => _toggleRole(role),
                    selectedColor: Colors.teal.withOpacity(0.3),
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),

              // Document Upload Section
              const Text(
                'Upload Documents:',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),

              // NIC Front
              ListTile(
                leading: const Icon(Icons.credit_card),
                title: Text(_nicFrontFileName ?? 'NIC Front'),
                trailing: _isFrontNICUploaded
                    ? const Icon(Icons.check_circle, color: Colors.green)
                    : const Icon(Icons.upload_file),
                onTap: _pickNicFrontFile,
              ),

              // NIC Back
              ListTile(
                leading: const Icon(Icons.credit_card),
                title: Text(_nicBackFileName ?? 'NIC Back'),
                trailing: _isBackNICUploaded
                    ? const Icon(Icons.check_circle, color: Colors.green)
                    : const Icon(Icons.upload_file),
                onTap: _pickNicBackFile,
              ),

              // Selfie
              ListTile(
                leading: const Icon(Icons.camera_alt),
                title: Text(_selfieFileName ?? 'Selfie'),
                trailing: _selfieFileUploaded
                    ? const Icon(Icons.check_circle, color: Colors.green)
                    : const Icon(Icons.upload_file),
                onTap: _pickSelfieFile,
              ),

              const SizedBox(height: 24),

              // Register Button
              ElevatedButton(
                onPressed: _registerUser,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 15),
                ),
                child: const Text('Register', style: TextStyle(fontSize: 18)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:intl_phone_field/intl_phone_field.dart'; // Add this import
import 'dart:io';

import 'package:image_picker/image_picker.dart';

import '../services/register_service.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  late final RegisterService _registerService;

  final _formKey = GlobalKey<FormState>();
  final _nicController = TextEditingController();
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _optController = TextEditingController();
  // Remove the old phone controller
  // final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _passwordVisible = false;
  bool _confirmPasswordVisible = false;
  bool _isEmailVerified = false;
  bool _isFrontNICUploaded = false;
  bool _isBackNICUploaded = false;
  bool _selfieFileUploaded = false;

  // Add these new variables for phone number
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
    _registerService = RegisterService(baseUrl: 'http://localhost:8080');
    _loadUserRoles();
  }

  void _loadUserRoles() async {
    try {
      final roles = await _registerService.getUserRoles();
      setState(() {
        _roles.clear();
        _roles.addAll(roles.map((role) => role['label']!));
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load roles: $e')),
      );
    }
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

    try {
      final result = await _registerService.sendOTP(_emailController.text);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result)),
      );
    } catch (e) {
      print(e);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to send OTP: $e'),
          duration: Duration(seconds: 20),
        ),
      );
    }
  }

  void _verifyEmail() async {
    if (_emailController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter your email first')),
      );
      return;
    }

    if (_optController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter the OTP')),
      );
      return;
    }

    try {
      final result = await _registerService.verifyOTP(
        _emailController.text,
        _optController.text,
      );

      setState(() {
        _isEmailVerified = true;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result)),
      );
    } catch (e) {
      setState(() {
        _isEmailVerified = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Email verification failed: $e')),
      );
    }
  }

  void _registerUser() async {
    if (_formKey.currentState!.validate()) {
      // Validate documents before proceeding
      final documentValidation = _registerService.validateDocuments(
        nicFrontDocument: _nicFrontFile,
        nicBackDocument: _nicBackFile,
        selfieDocument: _selfieFile,
      );

      if (documentValidation != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(documentValidation)),
        );
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
          return const Center(
            child: CircularProgressIndicator(),
          );
        },
      );

      try {
        final result = await _registerService.registerUser(
          nicNumber: _nicController.text,
          name: _fullNameController.text,
          email: _emailController.text,
          phoneNumber: _completePhoneNumber, // Use complete phone number with country code
          password: _passwordController.text,
          confirmPassword: _confirmPasswordController.text,
          nicFrontDocument: _nicFrontFile,
          nicBackDocument: _nicBackFile,
          selfieDocument: _selfieFile,
          userRoles: _selectedRoles,
          otpVerified: _isEmailVerified,
        );

        Navigator.of(context).pop();

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(result),
            backgroundColor: Colors.green,
          ),
        );

        Navigator.of(context).pop();
      } catch (e) {
        Navigator.of(context).pop();

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Registration failed: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _checkExistingUser() async {
    if (_emailController.text.isNotEmpty || _nicController.text.isNotEmpty) {
      try {
        final result = await _registerService.checkExistingUser(
          email: _emailController.text.isNotEmpty ? _emailController.text : null,
          nicNumber: _nicController.text.isNotEmpty ? _nicController.text : null,
        );

        if (result['emailExists'] == true) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Email already exists'),
              backgroundColor: Colors.orange,
            ),
          );
        }

        if (result['nicExists'] == true) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('NIC number already exists'),
              backgroundColor: Colors.orange,
            ),
          );
        }
      } catch (e) {
        print('Error checking existing user: $e');
      }
    }
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

  // File picker methods remain the same
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
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error picking file: $e')),
      );
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
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error picking file: $e')),
      );
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
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error picking file: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF00BCD4),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Register',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF00BCD4), Colors.white],
            stops: [0.0, 0.3],
          ),
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                // Profile Icon
                Container(
                  width: 80,
                  height: 80,
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFF6366F1), Color(0xFF8B5CF6)],
                    ),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.person,
                    color: Colors.black,
                    size: 40,
                  ),
                ),
                const SizedBox(height: 24),

                // Title and Subtitle
                const Text(
                  'Create Your Account',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Join our platform and start your journey',
                  style: TextStyle(fontSize: 16, color: Colors.black54),
                ),
                const SizedBox(height: 32),

                _buildTextField(
                  controller: _nicController,
                  label: 'NIC Number',
                  hint: 'Enter your NIC number',
                  suffixIcon: Icons.credit_card,
                  onChanged: (value) {
                    if (value.length >= 10) {
                      _checkExistingUser();
                    }
                  },
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your NIC number';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                _buildTextField(
                  controller: _fullNameController,
                  label: 'Full Name',
                  hint: 'Enter your full name',
                  suffixIcon: Icons.person,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your full name';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // Email section remains the same
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Email Address',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: _emailController,
                            keyboardType: TextInputType.emailAddress,
                            onChanged: (value) {
                              if (value.contains('@') && value.contains('.')) {
                                _checkExistingUser();
                              }
                            },
                            decoration: InputDecoration(
                              hintText: 'Enter your email address',
                              suffixIcon: const Icon(Icons.email),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide.none,
                              ),
                              filled: true,
                              fillColor: Colors.grey[100],
                            ),
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Please enter your email';
                              }
                              if (!RegExp(
                                r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
                              ).hasMatch(value)) {
                                return 'Please enter a valid email';
                              }
                              return null;
                            },
                          ),
                        ),
                        const SizedBox(width: 8),
                        ElevatedButton(
                          onPressed: _sendOTP,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.grey[300],
                            foregroundColor: Colors.black87,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 16,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: const Text('Send OTP'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: _optController,
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              hintText: 'Enter Verification Code',
                              suffixIcon: const Icon(Icons.pin),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide.none,
                              ),
                              filled: true,
                              fillColor: Colors.grey[100],
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        ElevatedButton(
                          onPressed: _verifyEmail,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 16,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 8.0),
                            child: Text('Verify Email'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Replace the old phone field with IntlPhoneField
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Phone Number',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 8),
                    IntlPhoneField(
                      decoration: InputDecoration(
                        hintText: 'Enter your phone number',
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide.none,
                        ),
                        filled: true,
                        fillColor: Colors.grey[100],
                        counterText: '', // Hide character counter
                      ),
                      initialCountryCode: 'LK', // Default to Sri Lanka since you're in Sri Lanka
                      onChanged: (phone) {
                        setState(() {
                          _completePhoneNumber = phone.completeNumber;
                          _phoneNumber = phone.number;
                          _countryCode = phone.countryCode;
                          _isPhoneValid = phone.isValidNumber();
                        });
                      },
                      validator: (phone) {
                        if (phone == null || phone.number.isEmpty) {
                          return 'Please enter your phone number';
                        }
                        if (!phone.isValidNumber()) {
                          return 'Please enter a valid phone number';
                        }
                        return null;
                      },
                      showCountryFlag: true,
                      showDropdownIcon: true,
                      flagsButtonPadding: const EdgeInsets.all(8),
                      dropdownIconPosition: IconPosition.trailing,
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Role selection remains the same
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Select Your Role(s)',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 12),
                    ..._roles
                        .map(
                          (role) => Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        child: InkWell(
                          onTap: () => _toggleRole(role),
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.grey[100],
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: _selectedRoles.contains(role)
                                    ? const Color(0xFF6366F1)
                                    : Colors.transparent,
                                width: 2,
                              ),
                            ),
                            child: Row(
                              children: [
                                Checkbox(
                                  value: _selectedRoles.contains(role),
                                  onChanged: (_) => _toggleRole(role),
                                  activeColor: const Color(0xFF6366F1),
                                ),
                                Text(
                                  role,
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    )
                        .toList(),
                  ],
                ),
                const SizedBox(height: 16),

                // Password fields remain the same
                _buildTextField(
                  controller: _passwordController,
                  label: 'Password',
                  hint: 'Enter password',
                  suffixIcon: _passwordVisible
                      ? Icons.visibility
                      : Icons.visibility_off,
                  obscureText: !_passwordVisible,
                  onSuffixTap: () {
                    setState(() {
                      _passwordVisible = !_passwordVisible;
                    });
                  },
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

                _buildTextField(
                  controller: _confirmPasswordController,
                  label: 'Confirm Password',
                  hint: 'Confirm password',
                  suffixIcon: _confirmPasswordVisible
                      ? Icons.visibility
                      : Icons.visibility_off,
                  obscureText: !_confirmPasswordVisible,
                  onSuffixTap: () {
                    setState(() {
                      _confirmPasswordVisible = !_confirmPasswordVisible;
                    });
                  },
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
                const SizedBox(height: 24),

                // Document upload section remains the same
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'NIC Document Upload',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        _buildUploadContainer(
                          icon: Icons.credit_card_outlined,
                          title: 'Front Side',
                          uploadText: 'Upload Front',
                          selectedFileName: _nicFrontFileName,
                          onTap: _pickNicFrontFile,
                          isSelected: _isFrontNICUploaded,
                        ),
                        const SizedBox(width: 8),
                        _buildUploadContainer(
                          icon: Icons.credit_card_outlined,
                          title: 'Back Side',
                          uploadText: 'Upload Back',
                          selectedFileName: _nicBackFileName,
                          onTap: _pickNicBackFile,
                          isSelected: _isBackNICUploaded,
                        ),
                        const SizedBox(width: 8),
                        _buildUploadContainer(
                          icon: Icons.person_outline,
                          title: 'Selfie',
                          uploadText: 'Upload Selfie',
                          selectedFileName: _selfieFileName,
                          onTap: _pickSelfieFile,
                          isSelected: _selfieFileUploaded,
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'PNG, JPG, JPEG up to 5MB',
                      style: TextStyle(fontSize: 12, color: Colors.black54),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
                const SizedBox(height: 32),

                // Verify Email Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _isEmailVerified ? null : _verifyEmail,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _isEmailVerified
                          ? Colors.green
                          : Colors.grey[400],
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(_isEmailVerified ? Icons.check : Icons.email),
                        const SizedBox(width: 8),
                        Text(
                          _isEmailVerified
                              ? 'Email Verified'
                              : 'Verify Email First',
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Register Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _registerUser,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color.fromARGB(255, 1, 2, 50),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Text(
                      'Register',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Sign In Link
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Already have an account? ',
                      style: TextStyle(color: Colors.black54),
                    ),
                    GestureDetector(
                      onTap: () => Navigator.of(context).pop(),
                      child: const Text(
                        'Sign in here',
                        style: TextStyle(
                          color: Color(0xFF6366F1),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // Keep your existing helper methods the same
  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData suffixIcon,
    bool obscureText = false,
    TextInputType keyboardType = TextInputType.text,
    String? Function(String?)? validator,
    VoidCallback? onSuffixTap,
    Function(String)? onChanged,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          obscureText: obscureText,
          keyboardType: keyboardType,
          validator: validator,
          onChanged: onChanged,
          decoration: InputDecoration(
            hintText: hint,
            suffixIcon: GestureDetector(
              onTap: onSuffixTap,
              child: Icon(suffixIcon),
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide.none,
            ),
            filled: true,
            fillColor: Colors.grey[100],
          ),
        ),
      ],
    );
  }

  Widget _buildUploadContainer({
    required IconData icon,
    required String title,
    required String uploadText,
    required String? selectedFileName,
    required VoidCallback onTap,
    required bool isSelected,
  }) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          height: 120,
          decoration: BoxDecoration(
            border: Border.all(
              color: isSelected ? const Color(0xFF6366F1) : Colors.grey[300]!,
              style: BorderStyle.solid,
              width: 2,
            ),
            borderRadius: BorderRadius.circular(8),
            color: isSelected ? Colors.green : Colors.grey[50],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                isSelected ? Icons.check_circle : icon,
                size: 40,
                color: isSelected ? Colors.white : Colors.grey[400],
              ),
              const SizedBox(height: 8),
              Text(
                isSelected ? 'Selected' : uploadText,
                style: TextStyle(
                  fontSize: 12,
                  color: isSelected ? Colors.white : Colors.black54,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                ),
                textAlign: TextAlign.center,
              ),
              if (isSelected && selectedFileName != null) ...[
                const SizedBox(height: 4),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: Text(
                    selectedFileName.length > 15
                        ? '${selectedFileName.substring(0, 15)}...'
                        : selectedFileName,
                    style: const TextStyle(fontSize: 10, color: Colors.black45),
                    textAlign: TextAlign.center,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class RegisterService {
  final String baseUrl;

  RegisterService({required this.baseUrl});

  // Factory constructor for development
  factory RegisterService.development() {
    return RegisterService(baseUrl: 'http://localhost:8080');
  }

  /// Get available user roles from the backend
  Future<List<Map<String, String>>> getUserRoles() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/users/roles'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.cast<Map<String, Object>>().map((item) => {
          'value': item['value'].toString(),
          'label': item['label'].toString(),
        }).toList();
      } else {
        throw Exception('Failed to fetch user roles: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching user roles: $e');
    }
  }

  /// Send OTP to email address
  Future<String> sendOTP(String email) async {
    try {
      if (email.isEmpty || !email.contains('@')) {
        throw Exception('Invalid email address');
      }

      final response = await http.get(
        Uri.parse('$baseUrl/api/users/send-otp?email=${Uri.encodeComponent(email)}'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      final Map<String, dynamic> data = json.decode(response.body);

      if (response.statusCode == 200) {
        return data['message'] ?? 'OTP sent successfully';
      } else {
        throw Exception(data['message'] ?? 'Failed to send OTP');
      }
    } catch (e) {
      if (e is Exception) {
        rethrow;
      }
      throw Exception('Network error: $e');
    }
  }

  /// Verify OTP for email verification
  Future<String> verifyOTP(String email, String otp) async {
    try {
      if (email.isEmpty) {
        throw Exception('Email is required');
      }

      if (otp.isEmpty) {
        throw Exception('OTP is required');
      }

      final response = await http.post(
        Uri.parse('$baseUrl/api/users/verify-otp'),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: {
          'email': email,
          'otp': otp,
        },
      );

      final Map<String, dynamic> data = json.decode(response.body);

      if (response.statusCode == 200) {
        return data['message'] ?? 'OTP verified successfully';
      } else {
        throw Exception(data['message'] ?? 'Invalid or expired OTP');
      }
    } catch (e) {
      if (e is Exception) {
        rethrow;
      }
      throw Exception('Network error: $e');
    }
  }

  /// Register a new user with all required information and documents
  Future<String> registerUser({
    required String nicNumber,
    required String name,
    required String email,
    required String phoneNumber,
    required String password,
    required String confirmPassword,
    File? nicFrontDocument,
    File? nicBackDocument,
    File? selfieDocument,
    required List<String> userRoles,
    required bool otpVerified,
  }) async {
    try {
      // Validate required fields
      if (nicNumber.isEmpty) {
        throw Exception('NIC number is required');
      }

      if (name.isEmpty) {
        throw Exception('Name is required');
      }

      if (email.isEmpty) {
        throw Exception('Email is required');
      }

      if (phoneNumber.isEmpty) {
        throw Exception('Phone number is required');
      }

      if (password.isEmpty) {
        throw Exception('Password is required');
      }

      if (confirmPassword.isEmpty) {
        throw Exception('Confirm password is required');
      }

      if (password != confirmPassword) {
        throw Exception('Passwords do not match');
      }

      if (userRoles.isEmpty) {
        throw Exception('Please select at least one role');
      }

      if (!otpVerified) {
        throw Exception('Please verify your email with OTP first');
      }

      // Validate at least one document is provided
      if (nicFrontDocument == null && nicBackDocument == null && selfieDocument == null) {
        throw Exception('At least one document (NIC Front, NIC Back, or Selfie) is required');
      }

      // Validate NIC number format
      final nicPattern = RegExp(r'^([0-9]{9}[vVxX]|[0-9]{12})$');
          if (!nicPattern.hasMatch(nicNumber)) {
    throw Exception('Invalid NIC format');
    }

    // Validate email format
    final emailPattern = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailPattern.hasMatch(email)) {
    throw Exception('Invalid email format');
    }

    // Validate phone number format
    final phonePattern = RegExp(r'^[0-9]{10}$');
    if (!phonePattern.hasMatch(phoneNumber)) {
    throw Exception('Phone number must be 10 digits');
    }

    // Create multipart request
    var request = http.MultipartRequest(
    'POST',
    Uri.parse('$baseUrl/api/users/register'),
    );

    // Add text fields
    request.fields.addAll({
    'nicNumber': nicNumber,
    'name': name,
    'email': email,
    'phoneNumber': phoneNumber,
    'password': password,
    'confirmPassword': confirmPassword,
    'otpVerified': otpVerified.toString(),
    });

    // ✅ Fixed: Add user roles as multiple fields with array notation
    for (int i = 0; i < userRoles.length; i++) {
    request.fields['userRoles[$i]'] = userRoles[i];
    }

    // Add file attachments if they exist
    if (nicFrontDocument != null && await nicFrontDocument.exists()) {
    request.files.add(
    await http.MultipartFile.fromPath(
    'nicFrontDocument',
    nicFrontDocument.path,
    ),
    );
    }

    if (nicBackDocument != null && await nicBackDocument.exists()) {
    request.files.add(
    await http.MultipartFile.fromPath(
    'nicBackDocument',
    nicBackDocument.path,
    ),
    );
    }

    if (selfieDocument != null && await selfieDocument.exists()) {
    request.files.add(
    await http.MultipartFile.fromPath(
    'selfieDocument',
    selfieDocument.path,
    ),
    );
    }

    // Set headers
    request.headers.addAll({
    'Content-Type': 'multipart/form-data',
    });

    // Send request
    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    final Map<String, dynamic> data = json.decode(response.body);

    if (response.statusCode == 200) {
    return data['message'] ?? 'User registered successfully';
    } else {
    // Handle different error scenarios
    String errorMessage = data['error'] ?? data['message'] ?? 'Registration failed';
    throw Exception(errorMessage);
    }
    } catch (e) {
    if (e is Exception) {
    rethrow;
    }
    throw Exception('Network error: $e');
    }
  }

  /// Validate file size (max 5MB)
  bool _validateFileSize(File file) {
    final bytes = file.lengthSync();
    final mb = bytes / (1024 * 1024);
    return mb <= 5;
  }

  /// Validate file type for images
  bool _validateFileType(String filePath) {
    final extension = filePath.split('.').last.toLowerCase();
    return ['png', 'jpg', 'jpeg'].contains(extension);
  }

  /// Validate uploaded documents
  String? validateDocuments({
    File? nicFrontDocument,
    File? nicBackDocument,
    File? selfieDocument,
  }) {
    // Check if at least one document is provided
    if (nicFrontDocument == null && nicBackDocument == null && selfieDocument == null) {
      return 'At least one document is required';
    }

    // Validate each document if provided
    final documents = [
      {'file': nicFrontDocument, 'name': 'NIC Front'},
      {'file': nicBackDocument, 'name': 'NIC Back'},
      {'file': selfieDocument, 'name': 'Selfie'},
    ];

    for (var doc in documents) {
      final file = doc['file'] as File?;
      final name = doc['name'] as String;

      if (file != null) {
        if (!file.existsSync()) {
          return '$name file does not exist';
        }

        if (!_validateFileSize(file)) {
          return '$name file size must be less than 5MB';
        }

        if (!_validateFileType(file.path)) {
          return '$name must be PNG, JPG, or JPEG format';
        }
      }
    }

    return null; // All validations passed
  }

  /// Get registration status or check if email/NIC already exists
  Future<Map<String, bool>> checkExistingUser({
    String? email,
    String? nicNumber,
  }) async {
    try {
      Map<String, String> queryParams = {};
      if (email != null && email.isNotEmpty) {
        queryParams['email'] = email;
      }
      if (nicNumber != null && nicNumber.isNotEmpty) {
        queryParams['nicNumber'] = nicNumber;
      }

      if (queryParams.isEmpty) {
        throw Exception('Email or NIC number is required');
      }

      final uri = Uri.parse('$baseUrl/api/users/check-existing')
          .replace(queryParameters: queryParams);

      final response = await http.get(
        uri,
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        return {
          'emailExists': data['emailExists'] ?? false,
          'nicExists': data['nicExists'] ?? false,
        };
      } else {
        throw Exception('Failed to check user existence');
      }
    } catch (e) {
      // If the endpoint doesn't exist, return false for both
      return {
        'emailExists': false,
        'nicExists': false,
      };
    }
  }
}
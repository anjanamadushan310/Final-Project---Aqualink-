import 'package:shared_preferences/shared_preferences.dart';

class ProfileService {
  static const String _businessNameKey = 'business_name';
  static const String _placeKey = 'place';
  static const String _streetKey = 'street';
  static const String _districtKey = 'district';
  static const String _townKey = 'town';
  static const String _profileImageKey = 'profile_image';

  static Future<void> saveBusinessName(String businessName) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_businessNameKey, businessName);
  }

  static Future<String?> getBusinessName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_businessNameKey);
  }

  static Future<void> saveAddress({
    required String place,
    required String street,
    required String district,
    required String town,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_placeKey, place);
    await prefs.setString(_streetKey, street);
    await prefs.setString(_districtKey, district);
    await prefs.setString(_townKey, town);
  }

  static Future<Map<String, String>> getAddress() async {
    final prefs = await SharedPreferences.getInstance();
    return {
      'place': prefs.getString(_placeKey) ?? '',
      'street': prefs.getString(_streetKey) ?? '',
      'district': prefs.getString(_districtKey) ?? '',
      'town': prefs.getString(_townKey) ?? '',
    };
  }

  static Future<void> saveProfileImage(String imagePath) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_profileImageKey, imagePath);
  }

  static Future<String?> getProfileImage() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_profileImageKey);
  }

  static Future<void> clearAllData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_businessNameKey);
    await prefs.remove(_placeKey);
    await prefs.remove(_streetKey);
    await prefs.remove(_districtKey);
    await prefs.remove(_townKey);
    await prefs.remove(_profileImageKey);
  }
}

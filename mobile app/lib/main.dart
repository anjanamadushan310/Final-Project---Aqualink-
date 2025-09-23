import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'get_started.dart';

void main() {
  runApp(const GemStoreApp());
}

class GemStoreApp extends StatelessWidget {
  const GemStoreApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Set status bar style
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.light,
      ),
    );

    return MaterialApp(
      title: 'GemStore',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        fontFamily: 'SF Pro Display', // You can use your preferred font
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const GetStartedScreen(),
      routes: {
        '/get-started': (context) => const GetStartedScreen(),
        '/login': (context) =>
            const LoginScreen(), // You'll need to create this
        // Add more routes as needed
      },
    );
  }
}

// Placeholder for Login Screen - you'll need to create this
class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: const Center(child: Text('Login Screen - To be implemented')),
    );
  }
}

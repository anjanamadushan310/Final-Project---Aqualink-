import 'package:flutter/material.dart';

class stock_management extends StatelessWidget {
  const stock_management({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Stock Management'),
        backgroundColor: Colors.white,
        elevation: 1,
        foregroundColor: Colors.black,
      ),
      body: const Center(child: Text('Stock Management')),
    );
  }
}

import 'package:flutter/material.dart';

class orders_management extends StatelessWidget {
  const orders_management({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Orders Management'),
        backgroundColor: Colors.white,
        elevation: 1,
        foregroundColor: Colors.black,
      ),
      body: const Center(child: Text('Orders Management')),
    );
  }
}

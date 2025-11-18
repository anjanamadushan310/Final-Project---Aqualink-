import 'package:flutter/material.dart';

class delivery_history extends StatelessWidget {
  const delivery_history({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Delivery History'),
        backgroundColor: Colors.white,
        elevation: 1,
        foregroundColor: Colors.black,
      ),
      body: const Center(child: Text('Delivery History Page')),
    );
  }
}

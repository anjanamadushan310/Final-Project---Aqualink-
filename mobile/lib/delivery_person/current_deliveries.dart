import 'package:flutter/material.dart';

class current_deliveries extends StatelessWidget {
  const current_deliveries({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Current Deliveries'),
        backgroundColor: Colors.white,
        elevation: 1,
        foregroundColor: Colors.black,
      ),
      body: const Center(child: Text('Current Deliveries Page')),
    );
  }
}

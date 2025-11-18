import 'package:flutter/material.dart';

class delivery_requests extends StatelessWidget {
  const delivery_requests({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Delivery Requests'),
        backgroundColor: Colors.white,
        elevation: 1,
        foregroundColor: Colors.black,
      ),
      body: const Center(child: Text('Delivery Requests')),
    );
  }
}

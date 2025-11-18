import 'package:flutter/material.dart';

class quote_management extends StatelessWidget {
  const quote_management({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Quote Management'),
        backgroundColor: Colors.white,
        elevation: 1,
        foregroundColor: Colors.black,
      ),
      body: const Center(child: Text('Quote Management Page')),
    );
  }
}

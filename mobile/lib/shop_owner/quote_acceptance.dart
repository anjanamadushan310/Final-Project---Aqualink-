import 'package:flutter/material.dart';

class quote_acceptance extends StatelessWidget {
  const quote_acceptance({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Quote Acceptance'),
        backgroundColor: Colors.white,
        elevation: 1,
        foregroundColor: Colors.black,
      ),
      body: const Center(child: Text('Quote Acceptance')),
    );
  }
}

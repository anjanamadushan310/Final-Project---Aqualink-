import 'package:flutter/material.dart';

class earnings_tracker extends StatelessWidget {
  const earnings_tracker({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Earnings Tracker'),
        backgroundColor: Colors.white,
        elevation: 1,
        foregroundColor: Colors.black,
      ),
      body: const Center(child: Text('Earnings Tracker Page')),
    );
  }
}

import 'package:flutter/material.dart';

class service_history extends StatelessWidget {
  const service_history({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Service Provider History'),
        backgroundColor: Colors.white,
        elevation: 1,
        foregroundColor: Colors.black,
      ),
      body: const Center(child: Text('History')),
    );
  }
}

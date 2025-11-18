import 'package:flutter/material.dart';

class service_requests extends StatelessWidget {
  const service_requests({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Service Provider Requests'),
        backgroundColor: Colors.white,
        elevation: 1,
        foregroundColor: Colors.black,
      ),
      body: const Center(child: Text('Requests')),
    );
  }
}

import 'package:flutter/material.dart';

class my_bookings extends StatelessWidget {
  const my_bookings({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Bookings'),
        backgroundColor: Colors.white,
        elevation: 1,
        foregroundColor: Colors.black,
      ),
      body: const Center(child: Text('My Bookings')),
    );
  }
}

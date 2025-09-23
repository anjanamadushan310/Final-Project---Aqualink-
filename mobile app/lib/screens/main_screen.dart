import 'package:aqua_link/authentication/login.dart';
import 'package:aqua_link/pages/about_page.dart';
import 'package:aqua_link/pages/cart_page.dart';
import 'package:aqua_link/pages/contact_page.dart';
import 'package:aqua_link/pages/home_page.dart';
import 'package:aqua_link/pages/profile_page.dart';
import 'package:flutter/material.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  void _onPressedNavItems(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color.fromARGB(255, 82, 220, 237),
        title: const Text('AquaLink', style: TextStyle(fontSize: 24)),
        centerTitle: false,
      ),
      body: IndexedStack(
        index: _selectedIndex,
        children: [
          HomePage(),
          ProfilePage(),
          CartPage(),
          AboutPage(),
          ContactPage(),
        ],
      ),
      drawer: Drawer(
        child: Column(
          children: [
            Expanded(
              child: ListView(
                padding: EdgeInsets.zero,
                children: [
                  DrawerHeader(
                    decoration: BoxDecoration(
                      color: const Color.fromARGB(255, 115, 218, 230),
                    ),
                    child: Padding(
                      padding: EdgeInsets.all(8.0),
                      child: CircleAvatar(
                        radius: 40,
                        backgroundImage: AssetImage(
                          'assets/images/profile.png',
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const Divider(),
            ListTile(
              leading: Icon(Icons.logout),
              title: Text('Logout'),
              onTap: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginScreen()),
                );
              },
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: const Color.fromARGB(255, 82, 220, 237),
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_cart),
            label: 'Cart',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.info), label: 'About'),
          BottomNavigationBarItem(
            icon: Icon(Icons.contact_support),
            label: 'Contact',
          ),
        ],
        currentIndex: _selectedIndex,
        onTap: _onPressedNavItems,
      ),
    );
  }
}

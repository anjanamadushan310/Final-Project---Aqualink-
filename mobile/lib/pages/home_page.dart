import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        body: Column(
          children: [
            Container(
              color: Colors.white, // Set your desired background color
              child: TabBar(
                tabs: [
                  Tab(text: 'Fish Collection', icon: Icon(Icons.pool)),
                  Tab(text: 'Our Services', icon: Icon(Icons.build)),
                  Tab(text: 'Fish Supplies', icon: Icon(Icons.shopping_cart)),
                ],
                indicatorColor: Colors.deepPurple,
                labelColor: Colors.deepPurple,
                unselectedLabelColor: Colors.grey,
              ),
            ),
            Expanded(
              child: TabBarView(
                children: [
                  Center(child: Text('Fish Collection Content')),
                  Center(child: Text('Our Services Content')),
                  Center(child: Text('Fish Supplies & Equipment Content')),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

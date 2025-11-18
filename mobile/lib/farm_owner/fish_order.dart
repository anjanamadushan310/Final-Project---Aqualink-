import 'package:flutter/material.dart';

class FishOrder extends StatelessWidget {
  const FishOrder({super.key});

  @override
  Widget build(BuildContext context) {
    final orders = [
      {
        'id': 'ORD001',
        'customer': 'Saman Perera',
        'created': 'Sep 8, 2025, 10:23 AM',
        'updated': 'Sep 8, 2025, 10:30 AM',
        'status': 'CONFIRMED',
        'total': 'Rs.7,200.00',
        'customerInfo': {
          'name': 'Saman Perera',
          'email': 'saman@gmail.com',
          'phone': '0771234567',
          'address': '123 Main Street, Dehiwala',
          'city': 'Dehiwala',
          'district': 'Colombo',
        },
        'deliveryInfo': {
          'date': 'Sep 12, 2025',
          'contact': 'Saman Perera',
          'phone': '0123456789',
          'payment': 'Cash on Delivery',
        },
        'products': [
          {'name': 'Gold Fish (Medium)', 'qty': '5', 'price': 'Rs.2,500.00'},
          {
            'name': 'Aquarium Filter (External)',
            'qty': '1',
            'price': 'Rs.3,500.00',
          },
        ],
        'notes':
            'Add notes about fish selection, preparation, special handling, etc.',
        'summary': {
          'orderTotal': 'Rs.6,000.00',
          'deliveryFee': 'Rs.1,200.00',
          'total': 'Rs.7,200.00',
        },
        'actions': ['Start Processing'],
      },
      {
        'id': 'ORD002',
        'customer': 'Kamal Sha',
        'created': 'Sep 9, 2025, 08:45 PM',
        'updated': 'Sep 9, 2025, 09:15 AM',
        'status': 'PROCESSING',
        'total': 'Rs.8,750.00',
        'customerInfo': {
          'name': 'Kamal Sha',
          'email': 'kamalsha@gmail.com',
          'phone': '0776547895',
          'address': '456 Beach Road, Negombo',
          'city': 'Negombo',
          'district': 'Gampaha',
        },
        'deliveryInfo': {
          'date': 'Sep 11, 2025',
          'contact': 'Kamal Sha',
          'payment': 'Paid',
        },
        'products': [
          {'name': 'Koi Fish (Large)', 'qty': '2', 'price': 'Rs.5,000.00'},
          {
            'name': 'Fish Food Premium (1kg)',
            'qty': '3',
            'price': 'Rs.2,250.00',
          },
        ],
        'notes':
            'Selected best breeding pair from pond #3. Both fish are healthy and active.',
        'summary': {
          'orderTotal': 'Rs.6,000.00',
          'deliveryFee': 'Rs.2,750.00',
          'total': 'Rs.8,750.00',
        },
        'actions': ['Mark as Shipped'],
      },
      {
        'id': 'ORD003',
        'customer': 'Priya Jayawardena',
        'created': 'Sep 6, 2025, 12:30 PM',
        'updated': 'Sep 8, 2025, 08:00 AM',
        'status': 'SHIPPED',
        'total': 'Rs.4,200.00',
        'customerInfo': {
          'name': 'Priya Jayawardena',
          'email': 'priya@gmail.com',
          'phone': '0712345678',
          'address': '789 Temple Road, Kandy',
          'city': 'Kandy',
          'district': 'Kandy',
        },
        'deliveryInfo': {
          'date': 'Sep 15, 2025',
          'contact': 'Priya Jayawardena',
          'phone': '0123456789',
          'payment': 'Cash on Delivery',
        },
        'products': [
          {'name': 'Angel Fish (Pair)', 'qty': '1', 'price': 'Rs.1,200.00'},
          {'name': 'Aquarium Plants Set', 'qty': '1', 'price': 'Rs.3,000.00'},
        ],
        'notes':
            'Fish packed with extra oxygen. Delivery person instructed on fish handling.',
        'summary': {
          'orderTotal': 'Rs.2,000.00',
          'deliveryFee': 'Rs.2,200.00',
          'total': 'Rs.4,200.00',
        },
        'tracking': {
          'partner': 'Express Delivery Co.',
          'number': 'EXP123456789',
          'state': 'In Transit',
          'eta': 'Sep 15, 2025, 04:00 PM',
        },
        'actions': ['Mark as Delivered'],
      },
      {
        'id': 'ORD004',
        'customer': 'Nimal Fernando',
        'created': 'Sep 5, 2025, 04:10 PM',
        'updated': 'Sep 5, 2025, 04:10 PM',
        'status': 'CONFIRMED',
        'total': 'Rs.5,800.00',
        'customerInfo': {
          'name': 'Nimal Fernando',
          'email': 'nimal.fernando@gmail.com',
          'phone': '0765432190',
          'address': '152 Lake View, Kurunegala',
          'city': 'Kurunegala',
          'district': 'Kurunegala',
        },
        'deliveryInfo': {
          'date': 'Sep 12, 2025',
          'contact': 'Nimal Fernando',
          'payment': 'Cash on Delivery',
        },
        'products': [
          {
            'name': 'Guppy Fish (Mixed Colors)',
            'qty': '10',
            'price': 'Rs.1,500.00',
          },
          {
            'name': 'Small Aquarium Tank (20L)',
            'qty': '1',
            'price': 'Rs.2,500.00',
          },
        ],
        'notes':
            'Add notes about fish selection, preparation, special handling, etc.',
        'summary': {
          'orderTotal': 'Rs.4,000.00',
          'deliveryFee': 'Rs.1,800.00',
          'total': 'Rs.5,800.00',
        },
        'actions': ['Start Processing'],
      },
    ];

    final statusCounts = {'New': 2, 'Processing': 1, 'Shipped': 1, 'Total': 4};

    return Scaffold(
      backgroundColor: const Color(0xFFF7FAFC),
      appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            color: Colors.white,
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Order Management',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.all(16),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search orders...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                fillColor: Colors.white,
                filled: true,
              ),
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: orders.length,
              itemBuilder: (context, idx) => _OrderCard(order: orders[idx]),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatusChip extends StatelessWidget {
  final String label;
  final int count;
  final Color color;

  const _StatusChip(this.label, this.count, this.color);

  @override
  Widget build(BuildContext context) {
    return Chip(
      label: Text('$count'),
      avatar: CircleAvatar(backgroundColor: color, radius: 10),
      backgroundColor: color.withAlpha(25),
      labelStyle: TextStyle(color: color, fontWeight: FontWeight.bold),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    );
  }
}

class _OrderCard extends StatelessWidget {
  final Map<String, dynamic> order;

  const _OrderCard({required this.order});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeader(),
            const Divider(height: 24),
            _buildCustomerInfo(),
            const SizedBox(height: 16),
            _buildProducts(),
            if (order['notes']?.isNotEmpty ?? false) ...[
              const SizedBox(height: 16),
              _buildNotes(),
            ],
            const SizedBox(height: 16),
            _buildSummary(),
            const SizedBox(height: 16),
            _buildActions(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Order #${order['id']}',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Created: ${order['created']}',
                style: const TextStyle(color: Colors.grey, fontSize: 12),
              ),
            ],
          ),
        ),
        _StatusLabel(order['status'], order['total']),
      ],
    );
  }

  Widget _buildCustomerInfo() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          _InfoSection('Customer Information', order['customerInfo']),
          const SizedBox(width: 24),
          _InfoSection('Delivery Information', order['deliveryInfo']),
        ],
      ),
    );
  }

  Widget _buildProducts() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Products', style: TextStyle(fontWeight: FontWeight.bold)),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              for (final product in order['products'])
                Container(
                  margin: const EdgeInsets.only(right: 16, top: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey[200]!),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(product['name']),
                      Text('Qty: ${product['qty']}'),
                      Text(
                        product['price'],
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildNotes() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.blue[50],
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(order['notes']),
    );
  }

  Widget _buildSummary() {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Order Total'),
            Text(order['summary']['orderTotal']),
          ],
        ),
        const SizedBox(height: 4),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Delivery Fee'),
            Text(order['summary']['deliveryFee']),
          ],
        ),
        const Divider(),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Total', style: TextStyle(fontWeight: FontWeight.bold)),
            Text(
              order['summary']['total'],
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActions() {
    return Row(
      children: [
        for (final action in order['actions'])
          Expanded(
            child: ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text(action),
            ),
          ),
      ],
    );
  }
}

class _StatusLabel extends StatelessWidget {
  final String status;
  final String total;

  const _StatusLabel(this.status, this.total);

  Color get color {
    switch (status) {
      case 'CONFIRMED':
        return Colors.orange;
      case 'PROCESSING':
        return Colors.blue;
      case 'SHIPPED':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withAlpha(25),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        status,
        style: TextStyle(color: color, fontWeight: FontWeight.bold),
      ),
    );
  }
}

class _InfoSection extends StatelessWidget {
  final String title;
  final Map<String, dynamic> info;

  const _InfoSection(this.title, this.info);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        ...info.entries.map(
          (e) => Text(
            '${_formatLabel(e.key)}: ${e.value}',
            style: const TextStyle(fontSize: 13),
          ),
        ),
      ],
    );
  }

  String _formatLabel(String key) {
    switch (key) {
      case 'name':
        return 'Name';
      case 'email':
        return 'Email';
      case 'phone':
        return 'Phone';
      case 'address':
        return 'Address';
      case 'city':
        return 'City';
      case 'district':
        return 'District';
      case 'date':
        return 'Preferred Date';
      case 'contact':
        return 'Contact Person';
      case 'payment':
        return 'Payment';
      default:
        return key[0].toUpperCase() + key.substring(1);
    }
  }
}

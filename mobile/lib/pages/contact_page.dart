import 'package:flutter/material.dart';

class ContactPage extends StatelessWidget {
  const ContactPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Container(
          color: const Color(0xFFF0F8FF), // Light blue background
          child: Padding(
            padding: const EdgeInsets.all(16.0), // Reduced padding
            child: Column(
              children: [
                const SizedBox(height: 20),

                // Support Options Grid - Made responsive
                LayoutBuilder(
                  builder: (context, constraints) {
                    if (constraints.maxWidth < 600) {
                      // Stack vertically on small screens
                      return Column(
                        children: [
                          _buildSupportCard(
                            Icons.account_circle,
                            'Account Support',
                            'Help with registration, profile verification, and account management.',
                            const Color(0xFF4A90E2),
                          ),
                          const SizedBox(height: 16),
                          _buildSupportCard(
                            Icons.list_alt,
                            'Listing & Orders',
                            'Assistance with fish listings, order placement, and transaction issues.',
                            const Color(0xFF4CAF50),
                          ),
                          const SizedBox(height: 16),
                          _buildSupportCard(
                            Icons.help_outline,
                            'Platform Navigation',
                            'Guidance on using AQUALINK features and platform functionality.',
                            const Color(0xFF9C27B0),
                          ),
                          const SizedBox(height: 16),
                          _buildSupportCard(
                            Icons.headset_mic,
                            'Technical Support',
                            'Help with technical issues, bugs, and platform performance.',
                            const Color(0xFFFF9800),
                          ),
                        ],
                      );
                    } else {
                      // Use grid layout on larger screens
                      return Column(
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: _buildSupportCard(
                                  Icons.account_circle,
                                  'Account Support',
                                  'Help with registration, profile verification, and account management.',
                                  const Color(0xFF4A90E2),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: _buildSupportCard(
                                  Icons.list_alt,
                                  'Listing & Orders',
                                  'Assistance with fish listings, order placement, and transaction issues.',
                                  const Color(0xFF4CAF50),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Expanded(
                                child: _buildSupportCard(
                                  Icons.help_outline,
                                  'Platform Navigation',
                                  'Guidance on using AQUALINK features and platform functionality.',
                                  const Color(0xFF9C27B0),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: _buildSupportCard(
                                  Icons.headset_mic,
                                  'Technical Support',
                                  'Help with technical issues, bugs, and platform performance.',
                                  const Color(0xFFFF9800),
                                ),
                              ),
                            ],
                          ),
                        ],
                      );
                    }
                  },
                ),

                const SizedBox(height: 30),

                // Contact Information Cards - Made responsive
                LayoutBuilder(
                  builder: (context, constraints) {
                    if (constraints.maxWidth < 600) {
                      // Stack vertically on small screens
                      return Column(
                        children: [
                          _buildInfoCard(Icons.location_on, 'Address', [
                            'Institute of Technology',
                            'University of Moratuwa',
                            'Moratuwa, Sri Lanka',
                          ], const Color(0xFF2196F3)),
                          const SizedBox(height: 16),
                          _buildInfoCard(Icons.phone, 'Phone', [
                            '+94 11 2650001',
                            '+94 77 123 4567',
                            'Hotline: 1919',
                          ], const Color(0xFF4CAF50)),
                          const SizedBox(height: 16),
                          _buildInfoCard(Icons.email, 'Email', [
                            'info@aqualink.lk',
                            'support@aqualink.lk',
                            'admin@aqualink.lk',
                          ], const Color(0xFF00BCD4)),
                          const SizedBox(height: 18),
                          _buildInfoCard(
                            Icons.access_time,
                            'Business Hours',
                            [
                              'Monday - Friday: 8:00 AM - 6:00 PM',
                              'Saturday: 9:00 AM - 4:00 PM',
                              'Sunday: Closed',
                            ],
                            const Color(0xFFFF9800),
                          ),
                        ],
                      );
                    } else {
                      // Use side-by-side layout on larger screens
                      return Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              children: [
                                _buildInfoCard(
                                  Icons.location_on,
                                  'Address',
                                  [
                                    'Institute of Technology',
                                    'University of Moratuwa',
                                    'Moratuwa, Sri Lanka',
                                  ],
                                  const Color(0xFF2196F3),
                                ),
                                const SizedBox(height: 16),
                                _buildInfoCard(Icons.email, 'Email', [
                                  'info@aqualink.lk',
                                  'support@aqualink.lk',
                                  'admin@aqualink.lk',
                                ], const Color(0xFF00BCD4)),
                              ],
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              children: [
                                _buildInfoCard(Icons.phone, 'Phone', [
                                  '+94 11 2650001',
                                  '+94 77 123 4567',
                                  'Hotline: 1919',
                                ], const Color(0xFF4CAF50)),
                                const SizedBox(height: 16),
                                _buildInfoCard(
                                  Icons.access_time,
                                  'Business Hours',
                                  [
                                    'Monday - Friday: 8:00 AM - 6:00 PM',
                                    'Saturday: 9:00 AM - 4:00 PM',
                                    'Sunday: Closed',
                                  ],
                                  const Color(0xFFFF9800),
                                ),
                              ],
                            ),
                          ),
                        ],
                      );
                    }
                  },
                ),

                const SizedBox(height: 20),

                // Emergency Support
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE53E3E),
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Emergency Support',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'For urgent issues affecting live fish transportation or critical system failures:',
                        style: TextStyle(fontSize: 14, color: Colors.white),
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        crossAxisAlignment: WrapCrossAlignment.center,
                        children: [
                          const Icon(
                            Icons.phone,
                            color: Colors.white,
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          const Text(
                            'Emergency Hotline: 1919',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Available 24/7',
                        style: TextStyle(fontSize: 12, color: Colors.white70),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // NAQDA Verification
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFF4CAF50),
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'NAQDA Verification',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'For questions about NAQDA document verification and certification:',
                        style: TextStyle(fontSize: 14, color: Colors.white),
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        'Contact your regional NAQDA office',
                        style: TextStyle(fontSize: 14, color: Colors.white),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Or reach out through our platform for assistance',
                        style: TextStyle(fontSize: 14, color: Colors.white),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 30),

                // FAQ Section - Fixed with responsive layout
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16), // Reduced padding
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Frequently Asked Questions',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF333333),
                        ),
                      ),
                      const SizedBox(height: 20),

                      // FAQ Items - Made responsive
                      LayoutBuilder(
                        builder: (context, constraints) {
                          if (constraints.maxWidth < 600) {
                            // Stack vertically on small screens
                            return Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                _buildFAQItem(
                                  'How do I get verified on AQUALINK?',
                                  'Upload your NAQDA documents or business permits during registration. Our verification team will review and approve within 2-3 business days.',
                                ),
                                const SizedBox(height: 16),
                                _buildFAQItem(
                                  'What payment methods are supported?',
                                  'AQUALINK supports cash on delivery and online payment methods. More payment options will be added in future updates.',
                                ),
                                const SizedBox(height: 16),
                                _buildFAQItem(
                                  'How can I track my fish delivery?',
                                  'Once your order is confirmed, you\'ll receive real-time tracking updates through the platform and notifications.',
                                ),
                                const SizedBox(height: 16),
                                _buildFAQItem(
                                  'Can I cancel or modify my order?',
                                  'Orders can be modified or cancelled before the seller confirms them. Contact support for assistance with specific cases.',
                                ),
                              ],
                            );
                          } else {
                            // Use side-by-side layout on larger screens
                            return IntrinsicHeight(
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        _buildFAQItem(
                                          'How do I get verified on AQUALINK?',
                                          'Upload your NAQDA documents or business permits during registration. Our verification team will review and approve within 2-3 business days.',
                                        ),
                                        const SizedBox(height: 16),
                                        _buildFAQItem(
                                          'What payment methods are supported?',
                                          'AQUALINK supports cash on delivery and online payment methods. More payment options will be added in future updates.',
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        _buildFAQItem(
                                          'How can I track my fish delivery?',
                                          'Once your order is confirmed, you\'ll receive real-time tracking updates through the platform and notifications.',
                                        ),
                                        const SizedBox(height: 16),
                                        _buildFAQItem(
                                          'Can I cancel or modify my order?',
                                          'Orders can be modified or cancelled before the seller confirms them. Contact support for assistance with specific cases.',
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }
                        },
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 30),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSupportCard(
    IconData icon,
    String title,
    String description,
    Color color,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(25),
            ),
            child: Icon(icon, color: Colors.white, size: 24),
          ),
          const SizedBox(height: 12),
          Text(
            title,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Color(0xFF333333),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            description,
            style: const TextStyle(
              fontSize: 12,
              color: Color(0xFF666666),
              height: 1.3,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildInfoCard(
    IconData icon,
    String title,
    List<String> info,
    Color color,
  ) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Icon(icon, color: Colors.white, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                // Added Expanded to prevent overflow
                child: Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF333333),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ...info
              .map(
                (item) => Padding(
                  padding: const EdgeInsets.only(bottom: 4.0),
                  child: Text(
                    item,
                    style: const TextStyle(
                      fontSize: 14,
                      color: Color(0xFF666666),
                    ),
                  ),
                ),
              )
              .toList(),
        ],
      ),
    );
  }

  Widget _buildFAQItem(String question, String answer) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          question,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: Color(0xFF333333),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          answer,
          style: const TextStyle(
            fontSize: 12,
            color: Color(0xFF666666),
            height: 1.4,
          ),
        ),
      ],
    );
  }
}

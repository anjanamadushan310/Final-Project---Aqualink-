import 'package:flutter/material.dart';

class delivery_quote_request extends StatefulWidget {
  const delivery_quote_request({super.key});

  @override
  State<delivery_quote_request> createState() => _delivery_quote_requestState();
}

class _delivery_quote_requestState extends State<delivery_quote_request> {
  final _formKey = GlobalKey<FormState>();
  final _placeController = TextEditingController();
  final _streetController = TextEditingController();

  String? selectedDistrict;
  String? selectedTown;
  String selectedQuoteExpiry = '24 hours';
  List<String> availableTowns = [];

  // District to Towns mapping - All 25 Districts of Sri Lanka
  final Map<String, List<String>> districtToTowns = {
    'Ampara': [
      'Ampara',
      'Kalmunai',
      'Sammanthurai',
      'Akkaraipattu',
      'Nintavur',
      'Sainthamaruthu',
      'Pottuvil',
      'Uhana',
      'Padiyatalawa',
      'Damana',
      'Lahugala',
      'Mahaoya',
      'Dehiattakandiya',
    ],
    'Anuradhapura': [
      'Anuradhapura',
      'Kekirawa',
      'Medawachchiya',
      'Habarana',
      'Mihintale',
      'Thambuttegama',
      'Eppawala',
      'Galenbindunuwewa',
      'Galnewa',
      'Talawa',
      'Nochchiyagama',
      'Kebithigollewa',
      'Rambewa',
      'Madatugama',
      'Thirappane',
    ],
    'Badulla': [
      'Badulla',
      'Bandarawela',
      'Haputale',
      'Welimada',
      'Mahiyanganaya',
      'Hali Ela',
      'Ella',
      'Passara',
      'Diyatalawa',
      'Kandaketiya',
      'Haldummulla',
      'Soranathota',
      'Meegahakivula',
      'Uva Paranagama',
      'Lunugala',
    ],
    'Batticaloa': [
      'Batticaloa',
      'Kattankudy',
      'Eravur',
      'Valachchenai',
      'Kaluwanchikudy',
      'Chenkalady',
      'Oddamavadi',
      'Kiran',
      'Arayampathy',
      'Vakarai',
      'Koralai Pattu',
      'Manmunai',
    ],
    'Colombo': [
      'Colombo 01',
      'Colombo 02',
      'Colombo 03',
      'Colombo 04',
      'Colombo 05',
      'Colombo 06',
      'Colombo 07',
      'Colombo 08',
      'Colombo 09',
      'Colombo 10',
      'Colombo 11',
      'Colombo 12',
      'Colombo 13',
      'Colombo 14',
      'Colombo 15',
      'Dehiwala',
      'Mount Lavinia',
      'Moratuwa',
      'Kotte',
      'Battaramulla',
      'Maharagama',
      'Nugegoda',
      'Homagama',
      'Kesbewa',
      'Boralesgamuwa',
      'Pannipitiya',
      'Kolonnawa',
      'Kaduwela',
      'Avissawella',
      'Hanwella',
      'Padukka',
      'Horana',
      'Piliyandala',
      'Kelaniya',
      'Peliyagoda',
      'Wattala',
      'Ja-Ela',
      'Kadawatha',
      'Wellampitiya',
      'Angoda',
    ],
    'Galle': [
      'Galle',
      'Hikkaduwa',
      'Ambalangoda',
      'Elpitiya',
      'Bentota',
      'Baddegama',
      'Karapitiya',
      'Habaraduwa',
      'Unawatuna',
      'Ahangama',
      'Koggala',
      'Thalpe',
      'Dodanduwa',
      'Balapitiya',
      'Karandeniya',
      'Neluwa',
      'Nagoda',
      'Bope',
      'Pitigala',
      'Imaduwa',
    ],
    'Gampaha': [
      'Gampaha',
      'Negombo',
      'Katunayake',
      'Minuwangoda',
      'Ja-Ela',
      'Wattala',
      'Kelaniya',
      'Peliyagoda',
      'Kadawatha',
      'Ragama',
      'Kiribathgoda',
      'Delgoda',
      'Ganemulla',
      'Nittambuwa',
      'Veyangoda',
      'Mirigama',
      'Divulapitiya',
      'Attanagalla',
      'Dompe',
      'Biyagama',
      'Seeduwa',
      'Kandana',
      'Welisara',
      'Pugoda',
      'Warakapola',
    ],
    'Hambantota': [
      'Hambantota',
      'Tangalle',
      'Tissamaharama',
      'Ambalantota',
      'Beliatta',
      'Weeraketiya',
      'Middeniya',
      'Suriyawewa',
      'Sooriyawewa',
      'Katuwana',
      'Angunakolapelessa',
      'Lunugamvehera',
      'Ranna',
      'Bundala',
      'Kirinda',
      'Walasmulla',
      'Netolpitiya',
      'Barawakumbuka',
    ],
    'Jaffna': [
      'Jaffna',
      'Nallur',
      'Chavakachcheri',
      'Point Pedro',
      'Karainagar',
      'Velanai',
      'Chankanai',
      'Kopay',
      'Manipay',
      'Sandilipay',
      'Tellippalai',
      'Vaddukoddai',
      'Kayts',
      'Karainagar',
      'Nainativu',
      'Delft',
      'Analativu',
    ],
    'Kalutara': [
      'Kalutara',
      'Panadura',
      'Horana',
      'Beruwala',
      'Aluthgama',
      'Matugama',
      'Bandaragama',
      'Wadduwa',
      'Payagala',
      'Ingiriya',
      'Bulathsinhala',
      'Dodangoda',
      'Agalawatta',
      'Mathugama',
      'Palindanuwara',
      'Millaniya',
      'Madurawala',
      'Dharga Town',
      'Kollupitiya',
    ],
    'Kandy': [
      'Kandy',
      'Peradeniya',
      'Gampola',
      'Nawalapitiya',
      'Katugastota',
      'Akurana',
      'Kadugannawa',
      'Pilimatalawa',
      'Wattegama',
      'Teldeniya',
      'Gelioya',
      'Pussellawa',
      'Harispattuwa',
      'Pathahewaheta',
      'Udadumbara',
      'Daulagala',
      'Galagedara',
      'Kundasale',
      'Pallekele',
      'Digana',
      'Madawala',
      'Udapalatha',
      'Ududumbara',
    ],
    'Kegalle': [
      'Kegalle',
      'Mawanella',
      'Warakapola',
      'Rambukkana',
      'Galigamuwa',
      'Dehiowita',
      'Deraniyagala',
      'Yatiyantota',
      'Ruwanwella',
      'Aranayake',
      'Kitulgala',
      'Bulathkohupitiya',
      'Karawanella',
    ],
    'Kilinochchi': [
      'Kilinochchi',
      'Pallai',
      'Paranthan',
      'Poonakary',
      'Karachchi',
      'Pachchilaipalli',
      'Kandavalai',
      'Akkarayankulam',
    ],
    'Kurunegala': [
      'Kurunegala',
      'Kuliyapitiya',
      'Narammala',
      'Wariyapola',
      'Pannala',
      'Melsiripura',
      'Mawathagama',
      'Polgahawela',
      'Nikaweratiya',
      'Alawwa',
      'Galgamuwa',
      'Dambadeniya',
      'Giriulla',
      'Bingiriya',
      'Ibbagamuwa',
      'Hettipola',
      'Maho',
      'Kobeigane',
      'Ridigama',
      'Katugampola',
    ],
    'Mannar': [
      'Mannar',
      'Madhu',
      'Nanattan',
      'Pesalai',
      'Thalaimannar',
      'Murunkan',
      'Adampan',
      'Vankalai',
      'Silavathurai',
      'Nanaddan',
    ],
    'Matale': [
      'Matale',
      'Dambulla',
      'Sigiriya',
      'Galewela',
      'Ukuwela',
      'Rattota',
      'Yatawatta',
      'Palapathwela',
      'Naula',
      'Pallepola',
      'Laggala',
      'Elkaduwa',
      'Ambanganga',
      'Wilgamuwa',
    ],
    'Matara': [
      'Matara',
      'Weligama',
      'Mirissa',
      'Kamburugamuwa',
      'Dikwella',
      'Akuressa',
      'Deniyaya',
      'Hakmana',
      'Devinuwara',
      'Gandara',
      'Kotapola',
      'Mulatiyana',
      'Thihagoda',
      'Pitabeddara',
      'Kekanadurra',
      'Kamburupitiya',
      'Athuraliya',
      'Pasgoda',
    ],
    'Monaragala': [
      'Monaragala',
      'Wellawaya',
      'Bibilegama',
      'Buttala',
      'Kataragama',
      'Siyambalanduwa',
      'Thanamalwila',
      'Medagama',
      'Sewanagala',
      'Madulla',
      'Okkampitiya',
      'Badalkumbura',
    ],
    'Mullaitivu': [
      'Mullaitivu',
      'Puthukkudiyiruppu',
      'Oddusuddan',
      'Manthai East',
      'Thunukkai',
      'Pudukudiyiruppu',
      'Maritimepattu',
      'Welioya',
    ],
    'Nuwara Eliya': [
      'Nuwara Eliya',
      'Hatton',
      'Nanuoya',
      'Talawakele',
      'Kotagala',
      'Lindula',
      'Ginigathena',
      'Walapane',
      'Bandarawela',
      'Welimada',
      'Ramboda',
      'Nildandahinna',
      'Bogawantalawa',
      'Agarapathana',
      'Rikillagaskada',
      'Dikoya',
      'Norton Bridge',
      'Ragala',
      'Hanguranketha',
    ],
    'Polonnaruwa': [
      'Polonnaruwa',
      'Kaduruwela',
      'Medirigiriya',
      'Hingurakgoda',
      'Dimbulagala',
      'Minneriya',
      'Welikanda',
      'Aralaganwila',
      'Jayanthipura',
      'Giritale',
      'Lankapura',
      'Bakamuna',
    ],
    'Puttalam': [
      'Puttalam',
      'Chilaw',
      'Wennappuwa',
      'Anamaduwa',
      'Nattandiya',
      'Dankotuwa',
      'Marawila',
      'Madampe',
      'Palavi',
      'Kalpitiya',
      'Mundel',
      'Udappuwa',
      'Mahawewa',
      'Karuwalagaswewa',
      'Norachcholai',
    ],
    'Ratnapura': [
      'Ratnapura',
      'Embilipitiya',
      'Balangoda',
      'Pelmadulla',
      'Eheliyagoda',
      'Kuruwita',
      'Kahawatta',
      'Godakawela',
      'Kalawana',
      'Nivithigala',
      'Opanayaka',
      'Weligepola',
      'Elapatha',
      'Ayagama',
      'Kolonna',
      'Imbulpe',
      'Kiriella',
    ],
    'Trincomalee': [
      'Trincomalee',
      'Kinniya',
      'Mutur',
      'Kuchchaveli',
      'Kantale',
      'Seruwila',
      'Gomarankadawala',
      'Thampalakamam',
      'Nilaveli',
      'Pulmoddai',
      'China Bay',
      'Town and Gravets',
    ],
    'Vavuniya': [
      'Vavuniya',
      'Nedunkeni',
      'Omanthai',
      'Vavuniya South',
      'Vengalacheddikulam',
      'Chettikulam',
      'Madhu Road',
      'Periyapandivirichchan',
      'Puliyankulam',
    ],
  };

  final List<String> quoteExpiryOptions = ['24 hours', '48 hours', '72 hours'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Delivery Quote Request'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 1.0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Order Summary Section
              _buildSectionCard(
                title: 'Order Summary',
                child: Container(
                  padding: const EdgeInsets.all(20),
                  child: const Column(
                    children: [
                      Icon(
                        Icons.inventory_2_outlined,
                        size: 48,
                        color: Colors.grey,
                      ),
                      SizedBox(height: 16),
                      Text(
                        'No items found',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color: Colors.grey,
                        ),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'Cart Items: 0',
                        style: TextStyle(color: Colors.grey),
                      ),
                      Text(
                        'Total Amount: 0',
                        style: TextStyle(color: Colors.grey),
                      ),
                      Text(
                        'Stored Data: Not found',
                        style: TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // Delivery Address Section
              _buildSectionCard(
                title: 'Delivery Address',
                child: Column(
                  children: [
                    _buildTextField(
                      controller: _placeController,
                      label: 'Place/Building',
                      hint: 'Enter building or place name',
                    ),
                    const SizedBox(height: 16),
                    _buildTextField(
                      controller: _streetController,
                      label: 'Street Address',
                      hint: 'Enter street address',
                    ),
                    const SizedBox(height: 16),
                    _buildDropdownField(
                      label: 'District',
                      value: selectedDistrict,
                      hint: 'Select District',
                      items: districtToTowns.keys.toList()..sort(),
                      onChanged: (value) {
                        setState(() {
                          selectedDistrict = value;
                          selectedTown =
                              null; // Reset town when district changes

                          // Update available towns based on selected district
                          if (value != null) {
                            availableTowns = List.from(
                              districtToTowns[value] ?? [],
                            )..sort();
                          } else {
                            availableTowns = [];
                          }
                        });
                      },
                    ),
                    const SizedBox(height: 16),
                    _buildDropdownField(
                      label: 'Town',
                      value: selectedTown,
                      hint: selectedDistrict == null
                          ? 'Select district first'
                          : 'Select Town',
                      items: availableTowns,
                      onChanged: selectedDistrict != null
                          ? (value) {
                              setState(() {
                                selectedTown = value;
                              });
                            }
                          : null,
                      disabled: selectedDistrict == null,
                    ),
                    if (selectedDistrict == null)
                      Padding(
                        padding: const EdgeInsets.only(top: 8.0),
                        child: Row(
                          children: [
                            Icon(
                              Icons.warning_amber_rounded,
                              size: 16,
                              color: Colors.grey[600],
                            ),
                            const SizedBox(width: 4),
                            Text(
                              'Please select a district first',
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Quote Preferences Section
              _buildSectionCard(
                title: 'Quote Preferences',
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Quotes should expire after:',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: selectedQuoteExpiry,
                      decoration: InputDecoration(
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide(color: Colors.grey[300]!),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide(color: Colors.grey[300]!),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: const BorderSide(color: Colors.blue),
                        ),
                      ),
                      items: quoteExpiryOptions.map((String value) {
                        return DropdownMenuItem<String>(
                          value: value,
                          child: Text(value),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          selectedQuoteExpiry = value!;
                        });
                      },
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 30),

              // Submit Button
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _submitQuoteRequest,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF4285F4),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    elevation: 2,
                  ),
                  child: const Text(
                    'Submit Quote Request',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                ),
              ),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionCard({
    required String title,
    String? subtitle,
    required Widget child,
  }) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (subtitle != null) ...[
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      subtitle,
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.blue[600],
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ),
                ],
              ],
            ),
            const SizedBox(height: 16),
            child,
          ],
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required String hint,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: TextStyle(color: Colors.grey[400]),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 12,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Colors.grey[300]!),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Colors.grey[300]!),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Colors.blue),
            ),
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'This field is required';
            }
            return null;
          },
        ),
      ],
    );
  }

  Widget _buildDropdownField({
    required String label,
    required String? value,
    required String hint,
    required List<String> items,
    required ValueChanged<String?>? onChanged,
    bool disabled = false,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
        ),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          value: value,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: TextStyle(color: Colors.grey[400]),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 12,
            ),
            filled: disabled,
            fillColor: disabled ? Colors.grey[100] : Colors.white,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Colors.grey[300]!),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Colors.grey[300]!),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Colors.blue),
            ),
            disabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Colors.grey[300]!),
            ),
          ),
          items: items.isEmpty
              ? null
              : items.map((String item) {
                  return DropdownMenuItem<String>(
                    value: item,
                    child: Text(item),
                  );
                }).toList(),
          onChanged: disabled ? null : onChanged,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Please select $label';
            }
            return null;
          },
        ),
      ],
    );
  }

  void _submitQuoteRequest() {
    if (_formKey.currentState!.validate()) {
      // Show success message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Quote request submitted successfully!'),
          backgroundColor: Colors.green,
          action: SnackBarAction(
            label: 'OK',
            textColor: Colors.white,
            onPressed: () {
              ScaffoldMessenger.of(context).hideCurrentSnackBar();
            },
          ),
        ),
      );

      // Optionally navigate back or to another page
      // Navigator.pop(context);
    }
  }

  @override
  void dispose() {
    _placeController.dispose();
    _streetController.dispose();
    super.dispose();
  }
}
